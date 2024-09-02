
export const validateImage = (file, maxSizeMB = 10) => {
  const isValidFileType = file.type.startsWith('image/');
  const isValidFileSize = file.size <= maxSizeMB * 1024 * 1024;

  if (!isValidFileType) {
    return { valid: false, errorMessage: 'ფაილი უნდა იყოს ფოტო' };
  }
  if (!isValidFileSize) {
    return { valid: false, errorMessage: `ფოტო უნდა იყოს მაქსიმუმ ${maxSizeMB}მბ.` };
  }
  
  return { valid: true, errorMessage: '' };
};
