class CensorSensitiveInfo{
    public censor(info: string): string{
        const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g;

        const phoneNumberRegex = /(?:\+91|91|0)?[6-9]\d{9}/g;

        let censoredString;

        censoredString= info.replace(emailRegex , "*****");

        censoredString= censoredString.replace(phoneNumberRegex , "*****");

        return censoredString;

    }
}

export default new CensorSensitiveInfo()