package com.ginasystem.plugins.mbtiles;

import org.apache.cordova.CordovaResourceApi;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.database.Cursor;
import android.database.CursorWindow;
import android.database.sqlite.SQLiteCantOpenDatabaseException;
import android.database.sqlite.SQLiteCursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;
import android.net.Uri;
import android.os.Environment;
import android.util.Base64;
import android.util.Log;

import java.sql.SQLException;

/**
 * Simplification of com.makina.offline.mbtiles
 * 
 * @author <a href="mailto:sebastien.grimault@makina-corpus.com">S. Grimault</a>
 */
public class MBTilesActions
{
    static final String KEY_TILE_DATA = "tile_data";

    protected String mDirectory;
    protected Context mContext;
	private SQLiteDatabase db = null;

    public MBTilesActions(Context context, CordovaResourceApi resourceApi, String url, String name) throws SQLiteException {

        this.mContext = context;
        this.mDirectory = null;

        if (url == null || url.length() < 0) {
            url = "cdvfile://localhost/persistent/OfflineMaps/";
        }

        Uri fileURL = resourceApi.remapUri(Uri.parse(url));
        mDirectory = fileURL.getPath() + "/";

        if (getDirectory() != null) {
            String path = getDirectory() + name;
            try {
                this.db = SQLiteDatabase.openDatabase(path, null, SQLiteDatabase.NO_LOCALIZED_COLLATORS | SQLiteDatabase.OPEN_READONLY);
                Log.d(getClass().getName(), "openDatabase : " + this.db.getPath());
            } catch (SQLiteCantOpenDatabaseException e) {
                close();
                Log.e(getClass().getName(), "can't open database :" + e.getMessage());
            } catch (SQLiteException e) {
                Log.e(getClass().getName(), "openDatabase : " + this.db.getPath());
            }
        } else {
            close();
        }
	}

    /**
     * return the Current Directory
     * @return directory working
     */
    protected String getDirectory() {
        return mDirectory;
    }

	public boolean isOpen()
	{
		return (this.db != null) && this.db.isOpen();
	}

	public void close()
	{
		if (isOpen())
		{
			Log.d(getClass().getName(), "close '" + db.getPath() + "'");
			
			this.db.close();
			this.db = null;
		}
	}

    /**
     * Retrieves the tile as <code>JSONObject</code> into a Base64 representation according to given parameters.
     * <p>
     * One key is <strong>required</strong> :
     * <p>
     * <ul>
     * <li>tile_data : the tile data into a Base64 representation</li>
     * </ul>
     * @param zoomLevel the current zoom level
     * @param column column index
     * @param row row index
     * @return the tile as <code>JSONObject</code>
     */
	public JSONObject getTile(int zoomLevel, int column, int row)
	{
		Log.d(getClass().getName(), "getTile [" + zoomLevel + ", " + column + ", " + row + "]");
		
		int currentZoomLevel = zoomLevel;
		
		Cursor cursor = db.query("tiles",
				new String[]{"tile_data"},
				"zoom_level = ? AND tile_column = ? AND tile_row = ?",
				new String[]{String.valueOf(currentZoomLevel), String.valueOf(column), String.valueOf(row)},
				null, null, null);
		
		JSONObject tileData = new JSONObject();
		
		// we should have only one result
		if (cursor.moveToFirst())
		{
			try
			{
                byte[] bytes = cursor.getBlob(cursor.getColumnIndex("tile_data"));
                if (bytes == null || bytes.length == 0)
                    return null;
				tileData.put(KEY_TILE_DATA, Base64.encodeToString(bytes, Base64.DEFAULT));
			}
			catch (JSONException je)
			{
				Log.e(getClass().getName(), je.getMessage(), je);
			}
		}
		
		cursor.close();
		
		return tileData;
	}

}
