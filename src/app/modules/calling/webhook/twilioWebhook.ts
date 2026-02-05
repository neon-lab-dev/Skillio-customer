import { HTTP_STATUS } from "@neon-lab-dev/platform";
import { create } from "xmlbuilder2";
import {  Request, Response } from "express";

class TwilioWebhook {
    public async twimlPost(req:Request , res: Response) {
        console.log("hello twiml")
        const to= req.body.To;

        const twimlResponse = create({ version: '1.0' })
            .ele('Response')
                .ele('Dial')
                    .ele('Client').txt(to)
                .up()
            .up()
            .end({ headless: true, prettyPrint: false });
        
        res
            .status(HTTP_STATUS.SUCCESS)
            .type('text/xml')
            .send(twimlResponse);
    }
}

export default new TwilioWebhook();