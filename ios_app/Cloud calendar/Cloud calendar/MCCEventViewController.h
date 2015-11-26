//
//  MCCEventViewController.h
//  Cloud calendar
//
//  Created by Roman Filippov on 23/11/15.
//  Copyright © 2015 MCC. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "MCCEvent.h"
#import "MCCCalendar.h"

@interface MCCEventViewController : UIViewController

@property (nonatomic, strong) MCCEvent *eventItem;
@property (nonatomic, strong) MCCCalendar *calendarItem;

@end
