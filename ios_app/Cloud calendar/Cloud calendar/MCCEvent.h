//
//  MCCEvent.h
//  Cloud calendar
//
//  Created by Roman Filippov on 24/11/15.
//  Copyright © 2015 MCC. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface MCCEvent : NSObject

@property (nonatomic, strong) NSString *__id;
@property (nonatomic, strong) NSString *__title;
@property (nonatomic, strong) NSString *__description;
@property (nonatomic, strong) NSString *__location;
@property (nonatomic, strong) NSDate *__startTime;
@property (nonatomic, strong) NSDate *__endTime;
@property (nonatomic, strong) NSString *__calendar;
@property (nonatomic, strong) NSString *__googleCalendarID;

@end
