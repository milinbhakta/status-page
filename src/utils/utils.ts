import https from "https";

export function isWebsiteOnline(url: string, callback: Function) {
  https
    .get(url, function (res) {
      callback(null, res.statusCode === 200 || res.statusCode === 401);
    })
    .on("error", function (err) {
      callback(err, false);
    });
}
