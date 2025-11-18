export interface Tcall{
    callerId: string;
    recipientId: string;
    conversationId: string;
    offer:webRtcSessionDescription;
    answer:webRtcSessionDescription;
}

export interface webRtcSessionDescription {
  type: "offer" | "answer";
  sdp: string;
}

export interface iceCandidatePayload {
  candidate: string;
  sdpMid?: string | null;
  sdpMLineIndex?: number | null;
  usernameFragment?: string | null;
}