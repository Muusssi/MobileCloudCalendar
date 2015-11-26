//
//  MCCCalendarViewController.m
//  Cloud calendar
//
//  Created by Roman Filippov on 23/11/15.
//  Copyright © 2015 MCC. All rights reserved.
//

#import <RestKit/RestKit.h>
#import "MCCCalendarViewController.h"
#import "MCCEvent.h"
#import "MCCEventViewController.h"
#import "MCCNewEventViewController.h"

@interface MCCCalendarViewController ()

@property (nonatomic, strong) NSArray *events;
@property (nonatomic, weak) IBOutlet UITableView *tableView;

@end

@implementation MCCCalendarViewController

- (void)viewDidLoad {
    [super viewDidLoad];

    self.navigationItem.title = self.calendarItem.__name;
    
    [self configureRestKit];
//    [self loadEvents];
}

- (void)configureRestKit
{
    // initialize RestKit
    RKObjectManager *objectManager = [RKObjectManager sharedManager];
    
    // setup object mappings
    RKObjectMapping *calMapping = [RKObjectMapping mappingForClass:[MCCEvent class]];
    [calMapping addAttributeMappingsFromDictionary:@{
                                                     @"_id":@"__id",
                                                     @"title": @"__title",
                                                     @"description": @"__description",
                                                     @"location":@"__location",
                                                     @"startTime":@"__startTime",
                                                     @"endTime":@"__endTime",
                                                     @"calendar":@"__calendar",
                                                     @"googleCalendarId":@"__googleCalendarID"
                                                     }];
    
    // register mappings with the provider using a response descriptor
    RKResponseDescriptor *responseDescriptor =
    [RKResponseDescriptor responseDescriptorWithMapping:calMapping
                                                 method:RKRequestMethodGET
                                            pathPattern:[NSString stringWithFormat:@"/calendars/%@/events",self.calendarItem.__id]
                                                keyPath:nil
                                            statusCodes:[NSIndexSet indexSetWithIndex:200]];
    
    [objectManager addResponseDescriptor:responseDescriptor];
}

- (void)loadEvents
{
    
    [[RKObjectManager sharedManager] getObjectsAtPath:[NSString stringWithFormat:@"/calendars/%@/events",self.calendarItem.__id]
                                           parameters:nil
                                              success:^(RKObjectRequestOperation *operation, RKMappingResult *mappingResult) {
                                                  _events = mappingResult.array;
                                                  [self.tableView reloadData];
                                              }
                                              failure:^(RKObjectRequestOperation *operation, NSError *error) {
                                                  NSLog(@"What do you mean by 'there is no coffee?': %@", error);
                                              }];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


//- (IBAction)newEventButtonPressed:(id)sender
//{
//    
//}

- (void)viewWillAppear:(BOOL)animated
{
    [self loadEvents];
}


#pragma mark - UITableView delegate

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return _events.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath*)indexPath
{
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"eventCell" forIndexPath:indexPath];
    
    MCCEvent *event = [_events objectAtIndex:indexPath.row];
    cell.textLabel.text = event.__title;
    cell.detailTextLabel.text = event.__description;
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    [self performSegueWithIdentifier:@"eventViewSegue" sender:[tableView cellForRowAtIndexPath:indexPath]];
}

- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    if([segue.identifier isEqualToString:@"eventViewSegue"]) {
        UITableViewCell *cell = (UITableViewCell *) sender;
        NSIndexPath *indexPath = [self.tableView indexPathForCell:cell];
        MCCEvent *event =[_events objectAtIndex:[indexPath row]];
        MCCEventViewController *controller = (MCCEventViewController *)segue.destinationViewController;
        controller.eventItem= event;
        controller.calendarItem = _calendarItem;
    } else if([segue.identifier isEqualToString:@"newEventSegue"]) {
        
        MCCNewEventViewController *controller = (MCCNewEventViewController *)segue.destinationViewController;
        controller.calendarItem= self.calendarItem;
    }
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
