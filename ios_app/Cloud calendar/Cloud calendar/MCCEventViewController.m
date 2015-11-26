//
//  MCCEventViewController.m
//  Cloud calendar
//
//  Created by Roman Filippov on 23/11/15.
//  Copyright © 2015 MCC. All rights reserved.
//

#import <RestKit/RestKit.h>
#import "MCCEventViewController.h"
#import "MCCNewEventViewController.h"

@interface MCCEventViewController ()

@property (nonatomic, weak) IBOutlet UITextView *textView;

@end

@implementation MCCEventViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat: @"yyyy-MM-dd HH:mm:ss zzz"];

    NSString *startDate = [formatter stringFromDate:_eventItem.__startTime];
    NSString *endDate = [formatter stringFromDate:_eventItem.__endTime];
    
    NSString *evenInfo = [NSString stringWithFormat:@"Title: %@\nDescription: %@\nLocation: %@\nStartTime: %@\nEndTime: %@",_eventItem.__title,_eventItem.__description,_eventItem.__location,startDate,endDate];
    
    self.textView.text = evenInfo;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)editButtonPressed:(id)sender
{
    [self performSegueWithIdentifier:@"editEventSegue" sender:self];
}

- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    if([segue.identifier isEqualToString:@"editEventSegue"]) {
        MCCNewEventViewController *controller = (MCCNewEventViewController *)segue.destinationViewController;
        controller.eventItem= _eventItem;
        controller.calendarItem = _calendarItem;
    }
}

- (IBAction)deleteButtonPressed:(id)sender
{
    [[RKObjectManager sharedManager] deleteObject:_eventItem path:[NSString stringWithFormat:@"/calendars/%@/events/%@/edit",self.eventItem.__calendar,self.eventItem.__id] parameters:nil success:^(RKObjectRequestOperation *operation, RKMappingResult *mappingResult) {
        NSLog(@"SUCCESS! %@",mappingResult);
        [self.navigationController popViewControllerAnimated:YES];
    } failure:^(RKObjectRequestOperation *operation, NSError *error) {
        NSLog(@"FAILED! %@",error);
    }];
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
