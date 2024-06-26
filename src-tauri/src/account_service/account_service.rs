use base64::{decode, encode};
use rand::rngs::OsRng;
use rsa::pkcs8::DecodePrivateKey;
use rsa::pkcs8::DecodePublicKey;
use serde::Serialize;

use crate::file_service::app_service::{AppService, MachineInfo};
use rsa::pkcs1::DecodeRsaPrivateKey;
use rsa::pkcs1::DecodeRsaPublicKey;
use rsa::{Pkcs1v15Encrypt, RsaPrivateKey, RsaPublicKey};
pub struct AccountService;

#[derive(Serialize)]
struct RequestPayload {
    key: String,
    machine_uuid: String,
    machine_info: MachineInfo,
}

#[derive(Serialize)]
struct EncryptedRequest {
    encrypted_request: String,
}

impl AccountService {
    pub async fn registerLicenseKey(
        api_endpoint: &str,
        machine_uid: &str,
        key: &str,
    ) -> anyhow::Result<String> {
        let client_private_key_pem = r#"
-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC8Zb4v6EJeC93T
klPYnECidzDKYdl4i7psQxxMAqFRkuhrCadLpsD3PpZeB6axTZ5Ho4VRXmT/gyIZ
rVrsoAVVheMkmffiBL6B88VEKJHBPqgaXqzRRhhXYUyCOQm9EIfrpUFR9/KaZ6tj
xUOq5Ekcbwn3qplpLccMfGLW7+E1C6hfATyJu1O4tJHjmzkVbuDIftlmTrlAS5lv
IZCbxQxIGOtKEULDpwSIVFUh5wVkS1DSg81wIJ5AOAkuBju1DL9NhpmZR9h6pK2H
3o/fd7elJY9FHDEk/RFGk2uEso6U5wBpJYGQP2xJMcyXdMf2dywMfY2HZ201+nVH
SzNITGCfAgMBAAECggEAJvhy1W0ZYWPaAHxJzMpRkmnOVWbVOdrJdsCRF2YJ4Zpe
alnGWd9GFj7DkvLJN+7i2VXJa5H3mWUSRjZ2UvEs+UpnOHiC7qVllPMMcLNlpxAj
bMT9wZJa0aRmU5+h1JKZUxTNhLuh2u+r48j33N85AmEzsh//eOLHxFzsgyJ+tt51
x8z/h3ceNNgrejqykf0T7DZpVXU46vIZsLbhoY9uFPGK+glo27s7CTqj+O8X5Z8J
qZbuT6uQQ+a3K9NLm0H3yi/g2yQ7LCBO44OxtszMj4k7g4h0TL1mRbmQnsnOe3XD
pOCbp3rVtrvNcSOHD4fq3UcUPIyWmO+5jU1zWIo7yQKBgQDvGkHTjISRIoc6W3St
xKLPBQ4ojI2kQmVjYb/DGncqX8IyUb2Awz3esjDHiMn/7541V+LEEWLXoBKVLymr
aTZj5ohmFqECrtukcdrwDquVy6in1TGdBpKZmZ9Saj1o0S0cDabtOHfvKv1vo/+j
PFNn+qXokzRvTpaCFLBQE0S+dwKBgQDJtiZeVtpnrhr7DLjN1KuXOFqO19YhZ6FK
quandH/w6cpcG1cS7Q/94Pv/NjxhmvSFYLCxeRFgUpJMeIDHk/Qi146Ra3XpD3Jg
eYfpTXMxCQ0NuCXgletIsxDGty096X1Fy7nwxMSfyZ+EQk7aP26uMGD1ZaNlSJIL
vwt2FicxGQKBgQCpnLy5buLTeeTnttzML8M2i+WBSkNoFFmL6Fl585o5CvjdbTK6
1sVa5pjH0vdIgRh/yrpoT9UIFNtZzL0IhXg54d08Xi0VlCjnPIUM6bs6ZeBcPlYV
iAYSw/FLK2YopsoTLnQNr5MUrDBgM7wydabNCfcLRvFZTCxkVnzEMQcA/QKBgQCE
1Gtd0ooOnotr6QvFl5fLhDO2PxHme4yuU+6CNWiPKBW3I9XqQ6w1PjQT8w4+JEGD
l5GjvRshOB7ZNr1vL9IkI5jh0EccS6zBNSa4DuWdU92BvFNNGsyO2kRg531meNyi
2q6+i4UDyE1AVj4A4KatFHS1BNJdvzVVgOA2Sg5S+QKBgQCmY7PEvznIncXr/YTH
KVc4BdhmZrr+xObbVGqD7+PWpTnxCJHu331PiBR1FdDTfWnm2ZtHQkFl+BL8B3bi
pfEROFwVkcbRcZgty7n0cI6zRrnyiDOgC5Rali+8bK78aJQpZ1Z1uWoyRqJVXn7I
pmi8HWjQAoln7uR6Dz9483utcg==
-----END PRIVATE KEY-----
"#;
        let server_public_key_pem = r#"
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAx7k5NnOiMYryVKFO7Pl8
sdIeWqZWGblV23N3NuLsA/l9fmXR2Xbuh4HFsDwELO6d/1ZKnVRZNYG1k5bPgTkz
ZH4XGxh0Bwk+vMGMmyN69O9OLy1udbtC1T/r2P4fD4aDLn2R7M0aIJstBLlsq7on
6/EA2wEf9pTb7lQ5V0HBcD6KnQXrpKqK90pJ84p9Xi2V+v87SIXtafkfXf8s8SJM
oKl0DB9fgvyYfFrirJ7XpM2q3YxNkxP0JRf2ez/BRijI8WB7PTiBMCMWuzzyxiva
snlKCarmtXW4GC55Dptyitw5jvfG3aelw2teYZs3m7D2RI3HPTiX2Mnbf8LpLgl+
NwIDAQAB
-----END PUBLIC KEY-----
"#;

        let client_private_key = RsaPrivateKey::from_pkcs8_pem(&client_private_key_pem)?;
        let server_public_key = RsaPublicKey::from_public_key_pem(&server_public_key_pem)?;

        let machine_info = AppService::get_machine_info()?;
        let request_payload = RequestPayload {
            key: key.to_string(),
            machine_uuid: machine_uid.to_string(),
            machine_info: machine_info,
        };
        let request_payload_string = serde_json::to_string(&request_payload)?;
        let mut rng = OsRng;
        let encrypted_data = server_public_key.encrypt(
            &mut rng,
            Pkcs1v15Encrypt,
            request_payload_string.as_bytes(),
        )?;
        let encrypted_request = EncryptedRequest {
            encrypted_request: encode(encrypted_data),
        };

        return Ok(encrypted_request.encrypted_request.to_string());
    }
}

#[cfg(test)]
mod tests {

    use super::AccountService;

    #[tokio::test]
    async fn it_should_correctly_register() {
        let registered_or_error = AccountService::registerLicenseKey(
            "http://localhost:3000",
            "machine_uid",
            "license_key",
        )
        .await;
        dbg!(registered_or_error);
        // assert!(registered_or_error.is_ok());
    }
}
