//
//  MBTilesActionsGenDataBaseImpl
//
//  Created on 20/03/14.
//
//

#import "MBTilesConstant.h"
#import "CDVFile.h"
#import <sqlite3.h>

/**
 * Treat database SQLite
 */
@interface MBTilesActions : NSObject
{
    // the database
    sqlite3* database;
    // synchronized
    NSLock* lock;

    // the directory
    NSString* directory;
    
    // cdvfile
    CDVFile* cdvfile;
}

/** 
 * open database with given parameters
 *
 * @param name the name of the file to open
 */
- (void)open:(NSString*) name;

/** 
 * test if the file was opened 
 *
 * @return YES or NO
 */
- (BOOL)isOpen;

/** 
 * close the file
 */
- (void)close;


/** 
 * get tiles with given parameters
 *
 * @param zoom_level the zoom level (z)
 * @param column the column (x)
*  @param row the row (y)
 * @return a dictionnary which contains the tiles associate in base64
 */
- (NSDictionary*)getTile:(int) zoom_level columnValue:(int) column rowValue:(int) row;


/*
 * init with a specific typepath and specific url
 */
- (id) initWithNameAndUrl:(NSString*)name withCDVFile:(CDVFile*)filePlugin withUrl:(NSString*) url;


- (NSString*) getFullDirectory;

@property(readwrite, retain)NSString* directory;
@property(readwrite, retain)CDVFile* cdvfile;

@property(readwrite, assign)sqlite3* database;
@property(readwrite, retain)NSLock* lock;

@end
