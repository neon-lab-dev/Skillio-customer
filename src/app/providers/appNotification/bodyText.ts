
class BodyText{
    public sendRegistrationRequest(nickName: string){
        const body={
            text: `Profiessional registration request from ${nickName}`
        }

        return body;
    }
}

export default new BodyText()