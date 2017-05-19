//
//  MBTilesActionsDataBaseImpl.m
//
//  Created on 20/03/14.
//
//

#import "MBTilesActions.h"

@implementation MBTilesActions
@synthesize database = _database;
@synthesize lock = _lock;
@synthesize cdvfile;
@synthesize directory;

/**
 * init the class
 */
- (id)init {
    @throw [NSException exceptionWithName:NSInternalInconsistencyException
                                   reason:@"-init is not a valid initializer for the class MBTilesActions"
                                 userInfo:nil];
    return nil;
}

- (id) initWithTypePath:(NSString*)tPath {
    @throw [NSException exceptionWithName:NSInternalInconsistencyException
                                   reason:@"-initWithTypePath is not a valid initializer for the class MBTilesActions"
                                 userInfo:nil];
    return nil;
}



- (id) initWithNameAndUrl:(NSString*)name withCDVFile:(CDVFile*)filePlugin withUrl:(NSString*) url {
    _database = nil;
    _lock = [[NSLock alloc] init];
    directory = url;
    cdvfile = filePlugin;
    
    [self open:name];
    
    return self;
}

- (void)open:(NSString*) name {
    
    [self close];
    
    NSFileManager *filemgr =  [NSFileManager defaultManager];
    NSString* dir = [self getFullDirectory];
    if (dir != nil) {
        NSString *absolutePath = [dir stringByAppendingPathComponent:name];
        // test if the file exist
        if ([filemgr fileExistsAtPath: absolutePath ] == YES) {
            const char *dbpath = [absolutePath UTF8String];
            // open the database
            if (sqlite3_open_v2(dbpath, &_database, SQLITE_OPEN_READONLY, NULL) != SQLITE_OK) {
                _database = nil;
            }
        } else {
            _database = nil;
        }
    }
}

- (BOOL)isOpen {
    return _database != nil;
}

- (void)close {
    if (_database != nil) {
        // close db
        sqlite3_close(_database);
    }
    database = nil;
}

- (NSDictionary*)getTile:(int) zoom_level columnValue:(int) column rowValue:(int) row {
    
    NSMutableDictionary* dict = [[NSMutableDictionary alloc] init];
    
    // test if db is open
    if ([self isOpen]) {
        // run query of tiles.
        const char* query = [[NSString stringWithFormat:@"SELECT tile_data FROM tiles WHERE zoom_level = ?1 AND tile_column = ?2 AND tile_row = ?3"] UTF8String];
        sqlite3_stmt* stmt;
        [_lock lock];
        int ret = sqlite3_prepare_v2(_database, query, -1, &stmt, NULL);
        if( ret == SQLITE_OK) {
            // bind value
            sqlite3_bind_int(stmt, 1, zoom_level);
            sqlite3_bind_int(stmt, 2, column);
            sqlite3_bind_int(stmt, 3, row);
            // treat answer
            if(sqlite3_step(stmt) == SQLITE_ROW) {
                NSUInteger blobLenght = sqlite3_column_bytes(stmt, 0);
                NSData * data = [NSData dataWithBytes:sqlite3_column_blob(stmt, 0) length:blobLenght];
                NSString * stringBase64 = [MBTilesConstant base64forData:data];
                [dict setObject:stringBase64 forKey:KEY_TILE_DATA];
            }
            sqlite3_finalize(stmt);
        }
        [_lock unlock];
    }
    return dict;
}

- (NSString*) getFullDirectory {
    NSString* dir = nil;
    // Get a CDVFilesystem URL object from a URL string
    CDVFilesystemURL* urlCDV = [CDVFilesystemURL fileSystemURLWithString:self.directory];
    // Get a path for the URL object, or nil if it cannot be mapped to a file
    dir = [cdvfile filesystemPathForURL:urlCDV];
    
    return dir;
}


- (void)dealloc {
    if ([self isOpen]) {
        [self close];
    }
}

@end
