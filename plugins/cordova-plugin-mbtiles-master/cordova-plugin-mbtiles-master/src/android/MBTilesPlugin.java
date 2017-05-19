package com.ginasystem.plugins.mbtiles;

import android.database.sqlite.SQLiteCantOpenDatabaseException;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.concurrent.ConcurrentHashMap;

/**
 * <code>MBTilesPlugin</code> Cordova plugin.
 * <p>
 * Manage MBTiles format as SQLite database or as filesystem.
 * 
 * @author <a href="mailto:sebastien.grimault@makina-corpus.com">S. Grimault</a>
 */
public class MBTilesPlugin extends CordovaPlugin
{
	// declaration of static variable
	public static final String ACTION_OPEN = "open";
	public static final String ACTION_GET_TILE = "getTile";
	
	// interface to treat action of plugin 
	private MBTilesActions mbTilesActions = null;

    /**
     * Multiple database map (static).
     */
    static ConcurrentHashMap<String, MBTilesActions> dbmap = new ConcurrentHashMap<String, MBTilesActions>();
	
	/*
	 * (non-Javadoc)
	 * @see org.apache.cordova.api.Plugin#execute(java.lang.String, org.json.JSONArray, java.lang.String)
	 */
	@Override
	 public boolean execute(String action, JSONArray data, CallbackContext callbackContext) throws JSONException {
		
		final JSONArray dataFinal = data;
		final String actionFinal = action;
		final CallbackContext callbackContextFinal = callbackContext;
		
		cordova.getThreadPool().execute(new Runnable() {
            public void run() {
		
	            PluginResult result = null;
				try
				{
                    if (actionFinal.equals(ACTION_OPEN))
					{
						result = actionOpen(dataFinal);
					}
					
					else if (actionFinal.equals(ACTION_GET_TILE))
					{
						result = actionGetTile(dataFinal);
					}
					
					if (result == null)
					{
						result = new PluginResult(PluginResult.Status.INVALID_ACTION);
					}
					
					callbackContextFinal.sendPluginResult(result);
				}
				catch (JSONException je)
				{
					callbackContextFinal.sendPluginResult(new PluginResult(PluginResult.Status.JSON_EXCEPTION));
				}
			}
        });
		return true;
	}
	
	/**
	 * Override of onDestroy method
	 */
	@Override
	public void onDestroy()
	{
		// close db if is not case
		if ((mbTilesActions != null) && mbTilesActions.isOpen())
		{
			mbTilesActions.close();
		}
		
		super.onDestroy();
	}

	
	/**
	 * open database or file with given name
	 *  * @param data : the parameters (name:'name')
	 * @return the pluginResult
	 */
	private PluginResult actionOpen(JSONArray data) throws JSONException {
        String url = data.getJSONObject(0).getString("url");
        String name = data.getJSONObject(0).getString("name");

        if (dbmap.containsKey(name)) {
            dbmap.get(name).close();
            dbmap.remove(name);
        }

        MBTilesActions runner;

        try {
            runner = new MBTilesActions(this.cordova.getActivity(), webView.getResourceApi(), url, name);
            Log.d(getClass().getName(), "openDatabase : " + url);
        } catch (SQLiteException e) {
            return new PluginResult(PluginResult.Status.IO_EXCEPTION, "can't open database :" + e.getMessage());
        }

        if (runner.isOpen()) {
            dbmap.put(name, runner);
            return new PluginResult(PluginResult.Status.OK);
        }

        return new PluginResult(PluginResult.Status.ERROR);
    }

	
	/**
	 * get tile of the database opened with given parameters
	 * @param data : the parameters (z:'z', x:'x', y:'y') 
	 * @return the pluginResult
	 */
	private PluginResult actionGetTile(JSONArray data) throws JSONException
	{
        String name = data.getString(0);

        if(!dbmap.containsKey(name))
            return new PluginResult(PluginResult.Status.ILLEGAL_ACCESS_EXCEPTION);
        MBTilesActions runner = dbmap.get(name);

		if ((runner != null) && runner.isOpen())
		{
            JSONObject tile = runner.getTile(
                    data.getJSONObject(1).getInt("z"),
                    data.getJSONObject(1).getInt("x"),
                    data.getJSONObject(1).getInt("y")
            );

            if (tile == null)
                return new PluginResult(PluginResult.Status.ERROR);

			return new PluginResult(PluginResult.Status.OK, tile);
		}

	    return new PluginResult(PluginResult.Status.IO_EXCEPTION);
	}
}

