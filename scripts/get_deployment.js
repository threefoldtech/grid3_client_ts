"use strict";
exports.__esModule = true;
var client_1 = require("../rmb-client/client");
var node_twin_id = 7;
var payload = JSON.stringify({ 'contract_id': 212 });
var rmb = new client_1.MessageBusClient(6379);
var msg = rmb.prepare("zos.deployment.get", [node_twin_id], 0, 2);
rmb.send(msg, payload);
rmb.read(msg, function (result) {
    console.log("result received");
    console.log(result);
});
