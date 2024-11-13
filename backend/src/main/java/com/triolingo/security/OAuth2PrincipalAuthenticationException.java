package com.triolingo.security;

import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.util.Assert;

public class OAuth2PrincipalAuthenticationException extends OAuth2AuthenticationException {

    private final String principalName;

    public OAuth2PrincipalAuthenticationException(OAuth2Error error, String principalName) {
        this(error, principalName, error.toString());
    }

    public OAuth2PrincipalAuthenticationException(OAuth2Error error, String principalName, String message) {
        super(error, message);
        Assert.hasText(principalName, "principalName cannot be empty");
        this.principalName = principalName;
    }

    public OAuth2PrincipalAuthenticationException(OAuth2Error error, String principalName, Throwable cause) {
        this(error, principalName, error.toString(), cause);
    }

    public OAuth2PrincipalAuthenticationException(OAuth2Error error, String principalName, String message,
            Throwable cause) {
        super(error, message, cause);
        Assert.hasText(principalName, "principalName cannot be empty");
        this.principalName = principalName;
    }

    public String getPrincipalName() {
        return this.principalName;
    }

}
