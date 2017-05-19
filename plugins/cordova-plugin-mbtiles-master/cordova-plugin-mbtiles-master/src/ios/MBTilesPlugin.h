//
//  MBTilesPlugin.h
//
//  Created on 19/03/14.
//
//

#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>
#import "MBTilesActions.h"


/**
* MBTilesPlugin, the plugin to treat *.mbtiles
*/
@interface MBTilesPlugin : CDVPlugin {
    NSMutableDictionary* dbmap;
}

/**
* action open 
*/
- (void)open:(CDVInvokedUrlCommand*)command;

/**
* action get_tile 
*/
- (void)getTile:(CDVInvokedUrlCommand*)command;

@property(readwrite, retain)NSMutableDictionary* dbmap;
@end
