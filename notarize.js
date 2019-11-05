
console.log("notarize.js ---- start");

// Load environment variables from a .env file into process.env
require("dotenv").config();

const { notarize } = require("electron-notarize");

exports.default = async function notarizing(context) {

	// Pull stuff from the given context
	const { electronPlatformName, appOutDir } = context;

	if (electronPlatformName != "darwin") {
		console.log("notarize.js ---- leaving without doing anything because we're not on macOS");
		return;
	}

	const appName = context.packager.appInfo.productFilename;

	console.log(`Notarizing '${appName}' in '${appOutDir}'`);
	console.log(`Contacting Apple as '${process.env.APPLEID}' with a ${process.env.PASSWORD.length} character password`);
	console.log("Now electron-notarize will upload the app to Apple's servers for automated analysis.");
	console.log("This can take around 5 minutes...");

	return await notarize({
		appBundleId: "com.ara.one.araFileManager",
		appPath: `${appOutDir}/${appName}.app`,
		appleId: process.env.APPLEID,
		appleIdPassword: process.env.PASSWORD,
	});
};

console.log("notarize.js ---- end, but will complete asynchronous step on macOS");
