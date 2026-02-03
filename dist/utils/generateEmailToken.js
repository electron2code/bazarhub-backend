import CryptoJS from "crypto-js";
export const generateEmailVerificationToken = () => {
    // 1. Generate 32 random bytes (256 bits)
    // crypto-js uses "words" (32-bit integers), so 8 words = 32 bytes
    const randomWordArray = CryptoJS.lib.WordArray.random(32);
    const token = randomWordArray.toString(CryptoJS.enc.Hex);
    // 2. Hash the token using SHA-256
    const hashedToken = CryptoJS.SHA256(token).toString(CryptoJS.enc.Hex);
    // 3. Set expiration (24 hours from now)
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return { token, hashedToken, expires };
};
