module.exports = "precision highp float;\nvarying vec2 vUv;\nvarying float vLighting;\nvarying vec3 vNormal;\nuniform vec3 light;\nvoid main() {\n    vUv = uv;\n    vec3 direction = normalize(  vec4(viewMatrix * vec4(position, 1. )).xyz - light );\n    vec3 transformedNormal = normalMatrix * normal;\n    float finalIntensity = max(0.0, dot(transformedNormal, - direction   ));\n    vec3 vNormal = normal;\n    finalIntensity = clamp(finalIntensity, 0.0, 1.0);\n    vLighting = finalIntensity;\n    vec3 pos = position;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );\n}"