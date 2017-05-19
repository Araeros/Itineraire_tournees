Environnement
======================

Android
----------------------

### __Environnement__

Windows, Mac, Linux

### __IDE__

Eclipse, IntelliJ, NetBeans, etc ..


iOS
----------------------

### __Environnement__

Mac

### __IDE__ 

XCode


How it works ? 
======================

This plugin can access to a database in sqlite or a file, to read mbtiles data. It create the link between webview and natif. This link depends of the OS where you will execute your program. just the interface in JavaScript must be the same to simplify the call of function. We will see by supported OS how it works and how call it.


Android
----------------------

You must create a class which extends CordovaPlugin, in this class override the function execute :

	public boolean execute(String action, JSONArray data, CallbackContext callbackContext) throws JSONException;

This function receive the call of javascript :

* __action__

 In this string we will find the name of function / action to execute

* __data__

 In this JSON we will find the parameters given by javascript
 
* __callbackContext__

 This class will can return the result to the Caller by a callback, the object returned is a PluginResult provides by the Cordova Library. 

	callbackContextFinal.sendPluginResult(new PluginResult(PluginResult.Status.JSON_EXCEPTION));

iOS
----------------------
You must create a class which extends CDVPlugin, in this class you can create all your function / action like this :

	- (void)open:(CDVInvokedUrlCommand*)command;

* __open__

 The name of the function / action

* __CDVInvokedUrlCommand__

 the command

command.arguments --> the parameters given by JavaScript

command.callbackId --> the callbackId to call.

To return the result to JavaScript :

	CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];



JavaScript
----------------------

### Android, iOS, Windows Phone 8

To call an function contained in your plugin, you must provide to the user an struct to call it easily.

_A Sample :_
	
cordova.exec(onSuccess, onError, "MBTilesPlugin", "open", [params]);

* __onSucess__

the function which receive a result of callback plugin --> function(result)

* __onError__

the function which receive an error of callback plugin --> function(error)

* __"MBTilesPlugin"__

the name of the plugin in file <plugin.xml>

* __"open"__

the action/function you call

* __[params]__

the parameters

### Blackberry

To call an function contained in your plugin, you must provide to the user an struct to call it easily.

_A Sample :_
	
	return cordova.exec(onSuccess, onError, "com.makina.offline.mbtiles", "open",  {input: input});

* __onSucess__

the function which receive a result of callback plugin --> function(result)

* __onError__

the function which receive an error of callback plugin --> function(error)

* __"com.makina.offline.mbtiles"__

the package name of the plugin 

* __"open"__

the action/function you call

* __{input: input}__

the parameters

Futhermore we need to create an another JavaScript file to plug the natif to the JavaScript, this file will be in src (index.js).

Initially declare all your function provides by your plugin like this :

	open: function (success, fail, args, env) {
		var result = new PluginResult(args, env),
		data = JSON.parse(decodeURIComponent(args.input)),
		response = <yourinstance>.getInstance().open(result.callbackId, data);
		result.ok(JSON.parse(response), false);
	},


Then declares a new struct JNEXT.yourplugin, in this struct load your library, this struc is your instance that you used before.

	JNEXT.MBTilesPlugin = function ()

	self.init = function () {
		if (!JNEXT.require("libMBTilesPlugin")) {
			return false;
		}

		self.m_id = JNEXT.createObject("libMBTilesPlugin.MBTilesPluginJS");

		if (self.m_id === "") {
			return false;
		}

		JNEXT.registerEvents(self);
	};

To finish in this struct declare all your function must be used by your instance 

	// calls into InvokeMethod(string command) 
	self.open = function (callbackId, input) {
		return JNEXT.invoke(self.m_id, "open " + callbackId + " " + JSON.stringify(input));
	};


Feature 
======================

To use it :

	var mbTilesPlugin = new MBTilesPlugin(filename, directoryUrl);
	mbTilesPlugin.open(function(result) {
		console.log("init : ");
	});





We will find in this plugin several features :

Glossary
----------------------

onSuccess --> function(result) {}

onError --> function(error) {}

init
----------------------

	_function(params, onSuccess, onError)_

### Description 

Open the database or save the workspace of file

### Parameters

__type__: 'file' or 'db'
__typepath__ : (optionnal) 'fullpath' or 'cdvfile'
__url__ : (optionnal) for path

To use the parameters typepath and url we need both !

For iOS the fullPath begin to the local directory of application


### Return

Nothing

open
----------------------

	_function(params, onSuccess, onError)_

### Description 

Open the database or save the workspace of file

### Parameters

__name__: name of database

### Return

Nothing

getMetadata
----------------------

	_function(onSuccess, onError)_

### Description 

Give the all metadata of the database or file

### Parameters

No Parameters

### Return

the metadata of the database or file

	{
		<name>: <value>,
		<name>: <value>,
		<name>: <value>,
		<name>: <value>,
		...,
		<name>: <value>
	}


getMinZoom
----------------------

	_function(onSuccess, onError)_

### Description 

Give the min zoom of the database or file

### Parameters

No Parameters

### Return

the min zoom in database or file

	{
		min_zoom: <value>
	}

getMaxZoom
----------------------

	_function(onSuccess, onError)_

### Description 

Give the max zoom of the database or file 

### Parameters

No Parameters

### Return

return the max zoom in the database or file

	{
		max_zoom: <value>
	}

getTile
----------------------

	_function(params, onSuccess, onError)_

### Description 

Give the data of tiles (z, x , y)

### Parameters

* __z__: zoom level

* __x__: colum

* __y__: row

### Return

The data of tiles in Base64.

	{
		tile_data: <value>
	}

executeStatement
----------------------

	_function(params, onSuccess, onError)_

### Description 

Can execute a query on database, and only database, this action is not implements for the type file

### Parameters

* __query__: the query to execute

* __params__: list of paremeters to bind ['param', 'param', 'param'] 

### Return

return the result of the query

	{
		result_execute: [
				{
					<name>: <value>,
					...,
					<name>: <value>
				},
				...,
				{
					<name>: <value>,
					...,
					<name>: <value>
				}
			]
			
		}
	}


getDirectoryWorking
----------------------

	_function(onSuccess, onError)_

### Description

Give the path of workspace of the database or file 

### Parameters

Nothing

### Return

the path of workspace of database/file

	{
		directory_working: <value>
	}

