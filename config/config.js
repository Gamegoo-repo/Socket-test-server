const base64Secret = "secretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecret";
const jwtSecret = Buffer.from(base64Secret, "base64");

module.exports = {
  jwtSecret,
};
