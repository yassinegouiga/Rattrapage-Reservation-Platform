package com.unif.gestionrattrapage.payload.response;

import lombok.Data;
import java.util.List;

@Data
public class JwtResponse {
	private String token;
	private String type = "Bearer";
	private Long id;
	private String nomComplet;
	private String email;
	private List<String> roles;

	public JwtResponse(String accessToken, Long id, String nomComplet, String email, List<String> roles) {
		this.token = accessToken;
		this.id = id;
		this.nomComplet = nomComplet;
		this.email = email;
		this.roles = roles;
	}
}
