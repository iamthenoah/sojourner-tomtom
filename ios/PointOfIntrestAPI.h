//
//  PointOfIntrestAPI.h
//  sojourner
//
//  Created by Noah Greff on 9/2/21.
//

#import <CoreLocation/CoreLocation.h>
#import "RCTBridgeModule.h"

@interface PointOfIntrestAPI : NSObject <RCTBridgeModule, CLLocationManagerDelegate>

@end
