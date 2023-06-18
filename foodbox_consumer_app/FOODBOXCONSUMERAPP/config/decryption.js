
export default function decryptString(string) {
  let decrypted = '';
  for (let i = 0; i < string.length; i++) {
    const char = string[i]; // 문자 추출
    const charCode = char.charCodeAt(0); // 문자의 ASCII 코드
    const modifiedCharCode = charCode - 10; // 사칙 연산 처리 (복호화)
    const decryptedChar = String.fromCharCode(modifiedCharCode); // 복호화된 문자
    decrypted += decryptedChar;
  }
  return decrypted;
}