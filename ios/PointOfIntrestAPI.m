//
//  PointOfIntrestAPI.m
//  sojourner
//
//  Created by Noah Greff on 9/2/21.
//

#import "PointOfIntrestAPI.h"

@implementation PointOfIntrestAPI
RCT_EXPORT_MODULE(PoiAPI);

/**
 * Defined `byQuery` Promise-like method for fetching points-of-interests from API.
 * All access to `api.tomtom.com` happens here. This completely eliminates the need
 * for the React-side application to handle http requests.
 *
 * @Param:search Required, search query for POI, ex: "restaurant".
 * @Param:additionalQueryParamaters Optional, query paramaters as key-value NSDictionary to append to url.
 */
RCT_EXPORT_METHOD(byQuery:(NSString *)search paramaters:(NSDictionary *)additionalQueryParamaters resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *endpoint = @"https://api.tomtom.com/search/2/poiSearch/";
  // append search query
  endpoint = [endpoint stringByAppendingFormat:@"%@.json", search];
  
  // construct URL object.
  NSURLComponents *components = [NSURLComponents componentsWithString:endpoint];
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
  
  components.queryItems = queryItems;

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
        reject(@"parsing_failure", @"An error occured while parsing data.", error);
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

@end
