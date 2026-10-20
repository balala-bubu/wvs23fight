/* Scuba Dance — retargetable hand-to-face IK for Three.js (global script).
 * Requires THREE and an articulated Object3D hierarchy.
 * Call update AFTER your normal dance/base pose each frame.
 * The right-hand CCD correction is computed fresh; base pose must be reapplied
 * on every frame to prevent accumulated IK drift.
 * Released for reuse in your game; no external assets.
 */
(function (root) {
  'use strict';
  function v3(value, def) {
    const a = value || def;
    return Array.isArray(a) ? new THREE.Vector3(...a) : a.clone();
  }
  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

  function pointWorld(node, local) {
    node.updateWorldMatrix(true, false);
    return node.localToWorld(local.clone());
  }

  /** Turn a parented joint toward a target using its end effector as reference. */
  function alignJoint(joint, handNode, handLocal, target, maxStepRad) {
    joint.updateWorldMatrix(true, true);
    const pivot = joint.getWorldPosition(new THREE.Vector3());
    const hand = pointWorld(handNode, handLocal);
    const from = hand.sub(pivot);
    const to = target.clone().sub(pivot);
    if (from.lengthSq() < 1e-8 || to.lengthSq() < 1e-8) return;
    from.normalize(); to.normalize();
    const angle = Math.acos(clamp(from.dot(to), -1, 1));
    if (angle < 1e-5) return;
    const axis = new THREE.Vector3().crossVectors(from, to);
    if (axis.lengthSq() < 1e-10) return;
    axis.normalize();
    const worldTurn = new THREE.Quaternion().setFromAxisAngle(axis, Math.min(angle, maxStepRad));
    const parentWorldQ = joint.parent
      ? joint.parent.getWorldQuaternion(new THREE.Quaternion())
      : new THREE.Quaternion();
    const invParent = parentWorldQ.clone().invert();
    const localTurn = invParent.multiply(worldTurn).multiply(parentWorldQ);
    joint.quaternion.premultiply(localTurn).normalize();
    joint.updateWorldMatrix(true, true);
  }

  function solveArm({ shoulder, elbow, hand, handLocal, target, iterations=12, tolerance=.025, maxStep=.55 }) {
    let error=Infinity;
    for (let i=0;i<iterations;i++) {
      // Elbow first, shoulder second (CCD); repeat to approach face target.
      alignJoint(elbow, hand, handLocal, target, maxStep);
      alignJoint(shoulder, hand, handLocal, target, maxStep);
      error = pointWorld(hand, handLocal).distanceTo(target);
      if (error <= tolerance) break;
    }
    return error;
  }

  /**
   * cfg required: head, shoulder, elbow, hand (THREE.Object3D).
   * cfg optional: noseLocal, handLocal, faceGap, noseAxis, leftPose,
   *               danceBasePose callback, bpm, loopBeats, ...
   * WARNING: noseLocal and handLocal are LOCAL to their respective nodes.
   */
  function create(cfg) {
    for (const k of ['head','shoulder','elbow','hand']) {
      if (!cfg[k] || !cfg[k].isObject3D) throw new Error('ScubaFaceIK missing Object3D: '+k);
    }
    if (!(cfg.hand === cfg.elbow || cfg.hand.parent)) throw new Error('Invalid hand node');
    const noseLocal = v3(cfg.noseLocal, [0,-.04,.65]);
    const handLocal = v3(cfg.handLocal, [0,-.18,0]);
    const noseAxis = v3(cfg.noseAxis, [0,0,1]).normalize();
    const faceGap = cfg.faceGap == null ? .12 : cfg.faceGap;
    const bpm = cfg.bpm || 120;
    const maxStep = cfg.maxStep == null ? .55 : cfg.maxStep;
    const tolerance = cfg.tolerance == null ? .025 : cfg.tolerance;

    return {
      /** Draw/pose the other arm and legs in your normal animation before update(). */
      update(t, dt) {
        // The base pose must be refreshed *each frame* to prevent drift.
        if (typeof cfg.danceBasePose === 'function') cfg.danceBasePose(t,dt);
        cfg.head.updateWorldMatrix(true, true);
        const target = pointWorld(cfg.head, noseLocal);
        // Surface clearance pushes palm OUTWARD so it does not enter the face.
        const outDir = noseAxis.clone().transformDirection(cfg.head.matrixWorld);
        target.addScaledVector(outDir, faceGap);
        const error = solveArm({
          shoulder:cfg.shoulder, elbow:cfg.elbow, hand:cfg.hand,
          handLocal, target,
          iterations: cfg.iterations || 12, tolerance, maxStep
        });
        const contact = pointWorld(cfg.hand, handLocal);
        return { error, target, contact, reached: error <= tolerance };
      }
    };
  }
  root.ScubaFaceIK = { create, solveArm };
})(typeof window !== 'undefined' ? window : globalThis);
