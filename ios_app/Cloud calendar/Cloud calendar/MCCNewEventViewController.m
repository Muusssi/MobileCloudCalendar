//
//  MCCNewEventViewController.m
//  Cloud calendar
//
//  Created by Roman Filippov on 23/11/15.
//  Copyright © 2015 MCC. All rights reserved.
//

#import <RestKit/RestKit.h>
#import "MCCNewEventViewController.h"
#import "MCCEvent.h"

@interface MCCNewEventViewController ()

@property (nonatomic, weak) IBOutlet UITextField *titleField;
@property (nonatomic, weak) IBOutlet UITextField *descriptionField;
@property (nonatomic, weak) IBOutlet UITextField *location;
@property (nonatomic, weak) IBOutlet UITextField *startTime;
@property (nonatomic, weak) IBOutlet UITextField *endTime;

@end

@implementation MCCNewEventViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    self.navigationItem.title = @"New event";
    
    UIDatePicker *datePicker = [[UIDatePicker alloc] init];
    datePicker.tag = 1;
    datePicker.datePickerMode = UIDatePickerModeDateAndTime;
    [datePicker addTarget:self action:@selector(pickerChangeValue:) forControlEvents:UIControlEventValueChanged];
    self.startTime.inputView = datePicker;
    
    UIDatePicker *datePicker2 = [[UIDatePicker alloc] init];
    datePicker2.tag = 2;
    datePicker2.datePickerMode = UIDatePickerModeDateAndTime;
    [datePicker2 addTarget:self action:@selector(pickerChangeValue:) forControlEvents:UIControlEventValueChanged];
    self.endTime.inputView = datePicker2;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)configureRestKit
{
    // initialize RestKit
    RKObjectManager *objectManager = [RKObjectManager sharedManager];
    
    // setup object mappings
    RKObjectMapping *calMapping = [RKObjectMapping requestMapping];
    [calMapping addAttributeMappingsFromDictionary:@{
                                                     @"__id":@"_id",
                                                     @"__title": @"title",
                                                     @"__description": @"description",
                                                     @"__location":@"location",
                                                     @"__startTime":@"startTime",
                                                     @"__endTime":@"endTime",
                                                     @"__calendar":@"calendar"
//                                                     @"googleCalendarId":@"__googleCalendarID"
                                                     }];
    
    // Now configure the request descriptor
    RKRequestDescriptor *requestDescriptor = [RKRequestDescriptor requestDescriptorWithMapping:calMapping objectClass:[MCCEvent class] rootKeyPath:nil method:RKRequestMethodPOST];
    [objectManager addRequestDescriptor:requestDescriptor];
//    // register mappings with the provider using a response descriptor
    RKResponseDescriptor *responseDescriptor =
    [RKResponseDescriptor responseDescriptorWithMapping:calMapping
                                                 method:RKRequestMethodPOST
                                            pathPattern:[NSString stringWithFormat:@"/calendars/%@/events",self.calendarItem.__id]
                                                keyPath:nil
                                            statusCodes:[NSIndexSet indexSetWithIndex:200]];
    
    [objectManager addResponseDescriptor:responseDescriptor];
}

- (void)setNewDateInField:(UITextField*)sender
{
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
    [formatter setDateFormat: @"yyyy-MM-dd HH:mm:ss zzz"];
    UIDatePicker *dp = (UIDatePicker*)[sender inputView];
    sender.text = [formatter stringFromDate:dp.date];
}

- (IBAction)dateFieldDidEndEditing:(UITextField*)sender
{
    [self setNewDateInField:sender];
    [sender resignFirstResponder];
}

- (void)pickerChangeValue:(UIDatePicker*)picker
{
    if (picker.tag == 1)
    {
        [self setNewDateInField:self.startTime];
    } else {
        [self setNewDateInField:self.endTime];
    }
}

- (IBAction)donePressed:(id)sender
{
    MCCEvent *event = [[MCCEvent alloc] init];
    event.__title = self.titleField.text;
    event.__description = self.descriptionField.text;
    event.__location = self.location.text;
    event.__startTime = ((UIDatePicker*)self.startTime.inputView).date;
    event.__endTime = ((UIDatePicker*)self.endTime.inputView).date;
//    event.__startTime = [NSDate date];
//    event.__endTime = [NSDate date];
    event.__calendar = self.calendarItem.__id;
    
    [self configureRestKit];
    
    [[RKObjectManager sharedManager] postObject:event path:[NSString stringWithFormat:@"/calendars/%@/events",self.calendarItem.__id] parameters:nil success:^(RKObjectRequestOperation *operation, RKMappingResult *mappingResult) {
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
