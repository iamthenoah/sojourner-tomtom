//
//  PointOfIntrestAPI.m
//  sojourner
//
//  Created by Noah Greff on 9/2/21.
//

#import "PointOfIntrestAPI.h"

@implementation PointOfIntrestAPI
RCT_EXPORT_MODULE(TomTomAPI);

/**
 * Defined `byQuery` Promise-like method for fetching points-of-interests from API.
 * All access to `api.tomtom.com` happens here. This completely eliminates the need
 * for the React-side application to handle http requests.
 *
 * @Param:search Required, search query for POI, ex: "restaurant".
 * @Param:additionalQueryParamaters Optional, query paramaters as key-value NSDictionary to append to url.
 */
RCT_EXPORT_METHOD(fetchPOI:(NSString *)search paramaters:(NSDictionary *)additionalQueryParamaters resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *endpoint = @"https://api.tomtom.com/search/2/poiSearch/";
  // append search query
  endpoint = [endpoint stringByAppendingFormat:@"%@.json", search];

  // create a key-value array for URL query paramaters,
  NSMutableArray *queryItems = [NSMutableArray array];
  
  // Appending API Key to query paramaters.
  // NOTE: Would not normally hard-code API key; kept it simple for the sake of this app.
  [queryItems addObject:[NSURLQueryItem queryItemWithName:@"key" value:@"xbut0FprHUpkK7BOoLxLzPYg6mDGOWyA"]];
  
  if ([additionalQueryParamaters count])
  {
    // if has query params, cycle through and append to url component
    for (NSString *key in additionalQueryParamaters)
    {
      [queryItems addObject:[NSURLQueryItem queryItemWithName:key value:additionalQueryParamaters[key]]];
    }
  }
  
  // append user to query paramaters coordinates if persmission are given
  [self appendUserCoordinates:queryItems];
  
  // construct URL object.
  NSURLComponents *components = [NSURLComponents componentsWithString:endpoint];
  components.queryItems = queryItems;

  NSLog(@"%@", components.URL);
  
  // create request with url and session for sending req.
  NSURLRequest *request = [NSURLRequest requestWithURL:components.URL];
  NSURLSession *session = [NSURLSession sharedSession];
  
  // perform request
  NSURLSessionDataTask *task = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error)
  {
    if (!error)
    {
      NSError *parsingError = nil;
      // attempt to parse JSON
      NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:&parsingError];
      
      if (parsingError)
      {
        reject(@"parsing_failure", @"An error occured while fetch data.", error);
      }
      else
      {
        resolve(json);
      }
    }
    else
    {
      reject(@"request_failure", @"Invalid search query provided.", error);
    }
  }];
  
  [task resume];
}

/**
 * Used to append user coordinates to URL when fetching from the API.
 */
- (void) appendUserCoordinates: (NSMutableArray*) queryParamaters {
  CLLocationManager *locationManager = [[CLLocationManager alloc] init];
  locationManager.delegate = self;
  locationManager.distanceFilter = kCLDistanceFilterNone;
  // get accuracy by km.
  locationManager.desiredAccuracy = kCLLocationAccuracyKilometer;

  // check ios version and request access to loc.
  if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0)
    [locationManager requestWhenInUseAuthorization];

  [locationManager startUpdatingLocation];
  
  double lon = locationManager.location.coordinate.longitude;
  double lat = locationManager.location.coordinate.longitude;

  // close location updating for performance.
  [locationManager stopUpdatingLocation];

  // convert double to string
  NSString *lonString = [NSString stringWithFormat:@"%f", lon];
  NSString *latString = [NSString stringWithFormat:@"%f", lat];

  // append to array
  [queryParamaters addObject:[NSURLQueryItem queryItemWithName:@"lon" value:lonString]];
  [queryParamaters addObject:[NSURLQueryItem queryItemWithName:@"lat" value:latString]];
}

@end
