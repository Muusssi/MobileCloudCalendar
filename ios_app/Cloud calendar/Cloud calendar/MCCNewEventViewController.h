//
//  MCCNewEventViewController.h
//  Cloud calendar
//
//  Created by Roman Filippov on 23/11/15.
//  Copyright © 2015 MCC. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "MCCCalendar.h"
#import "MCCEvent.h"

@interface MCCNewEventViewController : UIViewController

@property (nonatomic, strong) MCCCalendar *calendarItem;
@property (nonatomic, strong) MCCEvent *eventItem;


@end
