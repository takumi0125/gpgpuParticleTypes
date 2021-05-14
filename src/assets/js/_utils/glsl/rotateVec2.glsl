vec2 rotateVec2(vec2 p, float angle){
  float s = sin(angle);
	float c = cos(angle);
	mat2 m = mat2(c, -s, s, c);
	return m * p;
}
#pragma glslify: export(rotateVec2)
