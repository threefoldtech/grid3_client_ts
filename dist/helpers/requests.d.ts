import { Method } from "axios";
declare function send(method: Method, url: string, body: string, headers: Record<string, string>): Promise<never>;
export { send };
