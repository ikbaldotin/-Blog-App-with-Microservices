import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const Google_Client_Id = process.env.Google_Client_Id;
const Google_Client_SECRET = process.env.Google_client_Secret;

export const oauth2client = new google.auth.OAuth2(
  Google_Client_Id,
  Google_Client_SECRET,
  "postmessage"
);
