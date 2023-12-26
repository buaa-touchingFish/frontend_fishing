import JSEncrypt from 'jsencrypt';

const JSE = new JSEncrypt();

// 封装加密方法,这里就是写死的，都可以
export const encodeStr = (str: string) => {
    JSE.setPublicKey
    (`MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCLZ/W+SL604da54cySRTUOFJyQS/ZEYrVRx5JZM9vMpGAeSFljOJb2e1cwT9NQBRvyPqLY6+tl8foLqyJ69tvxfBQOLijpomAjz3+YdZhL0StMttEoWLQ4sLvXjPIWJAqgbwRwymIzQBZsN/h0c4AphhRJ5gBuOGygp2YjKlBH/QIDAQAB`)
  return JSE.encrypt(str);
}
