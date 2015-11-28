//
//  MCCCalendarsViewController.m
//  Cloud calendar
//
//  Created by Roman Filippov on 23/11/15.
//  Copyright © 2015 MCC. All rights reserved.
//

#import <RestKit/RestKit.h>
#import "MCCRootViewController.h"
#import "MCCCalendar.h"
#import "MCCCalendarViewController.h"

@interface MCCRootViewController ()

@property (nonatomic, strong) NSArray *calendars;

@end

@implementation MCCRootViewController

- (void)enterForeground {
    [self configureRestKit];
    [self loadCalendars];
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(enterForeground) name:UIApplicationWillEnterForegroundNotification object:nil];
    
    [self configureRestKit];
    [self loadCalendars];
}

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIApplicationWillEnterForegroundNotification object:nil];
}

- (void)configureRestKit
{
    // initialize AFNetworking HTTPClient
    NSURL *baseURL = [NSURL URLWithString:@"http://localhost:8080"];
    
    // initialize RestKit
    RKObjectManager *objectManager = [RKObjectManager managerWithBaseURL:baseURL];
    NSLog(@"%@",objectManager.defaultHeaders);
    
    // setup object mappings
    RKObjectMapping *calMapping = [RKObjectMapping mappingForClass:[MCCCalendar class]];
    [calMapping addAttributeMappingsFromDictionary:@{
                                                         @"_id":@"__id",
                                                         @"name": @"__name",
                                                         @"description": @"__description"
                                                         }];
    
    // register mappings with the provider using a response descriptor
    RKResponseDescriptor *responseDescriptor =
    [RKResponseDescriptor responseDescriptorWithMapping:calMapping
                                                 method:RKRequestMethodGET
                                            pathPattern:@"/calendars"
                                                keyPath:nil
                                            statusCodes:[NSIndexSet indexSetWithIndex:200]];
    
    [objectManager addResponseDescriptor:responseDescriptor];
}

- (void)loadCalendars
{
    
    [[RKObjectManager sharedManager] getObjectsAtPath:@"/calendars"
                                           parameters:nil
                                              success:^(RKObjectRequestOperation *operation, RKMappingResult *mappingResult) {
                                                  _calendars = mappingResult.array;
                                                  [self.tableView reloadData];
                                              }
                                              failure:^(RKObjectRequestOperation *operation, NSError *error) {
                                                  UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Connection problems"
                                                                                                  message:@"The app is unable to connect to the cloud calendar. Please check your internet connection."
                                                                                                 delegate:nil
                                                                                        cancelButtonTitle:@"OK"
                                                                                        otherButtonTitles:nil];
                                                  [alert show];
                                                  NSLog(@"Unable to connect the calendar server: %@", error);
                                              }];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)newCalendarButtonPressed:(id)sender
{
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"New Calendar"
                                                    message:@"Enter calendar name and description"
                                                   delegate:self
                                          cancelButtonTitle:@"Cancel"
                                          otherButtonTitles:@"Ok", nil];
    alert.alertViewStyle = UIAlertViewStyleLoginAndPasswordInput;
    [[alert textFieldAtIndex:1] setSecureTextEntry:NO];
    [[alert textFieldAtIndex:1] setPlaceholder:@"description"];
    [[alert textFieldAtIndex:0] setPlaceholder:@"name"];
    [alert show];
}

-(void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex{
    
    if (buttonIndex == 1){
        
        // initialize RestKit
        RKObjectManager *objectManager = [RKObjectManager sharedManager];
        
        // setup object mappings
        RKObjectMapping *calMapping = [RKObjectMapping requestMapping];
        [calMapping addAttributeMappingsFromDictionary:@{
                                                         @"__id":@"id",
                                                         @"__name": @"name",
                                                         @"__description": @"description"
                                                         }];
        
        // Now configure the request descriptor
        RKRequestDescriptor *requestDescriptor = [RKRequestDescriptor requestDescriptorWithMapping:calMapping objectClass:[MCCCalendar class] rootKeyPath:nil method:RKRequestMethodPOST];
        [objectManager addRequestDescriptor:requestDescriptor];
        
        // register mappings with the provider using a response descriptor
        RKResponseDescriptor *responseDescriptor =
        [RKResponseDescriptor responseDescriptorWithMapping:calMapping
                                                     method:RKRequestMethodPOST
                                                pathPattern:@"/calendars"
                                                    keyPath:nil
                                                statusCodes:[NSIndexSet indexSetWithIndex:200]];
        
        [objectManager addResponseDescriptor:responseDescriptor];
        
        
        MCCCalendar *calendar = [[MCCCalendar alloc] init];
        calendar.__name = [alertView textFieldAtIndex:0].text;
        calendar.__description = [alertView textFieldAtIndex:1].text;
        
        [[RKObjectManager sharedManager] postObject:calendar path:@"/calendars" parameters:nil success:^(RKObjectRequestOperation *operation, RKMappingResult *mappingResult) {
            NSLog(@"SUCCESS! %@",mappingResult);
            [self loadCalendars];
        } failure:^(RKObjectRequestOperation *operation, NSError *error) {
            NSLog(@"FAILED! %@",error);
        }];
    }
}


#pragma mark - UITableView delegate

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return _calendars.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath*)indexPath
{
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"Cell" forIndexPath:indexPath];
    
    MCCCalendar *calendar = [_calendars objectAtIndex:indexPath.row];
    cell.textLabel.text = calendar.__name;
    cell.detailTextLabel.text = calendar.__description;
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    [self performSegueWithIdentifier:@"eventsSegue" sender:[tableView cellForRowAtIndexPath:indexPath]];
}

- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    if([segue.identifier isEqualToString:@"eventsSegue"]) {
        UITableViewCell *cell = (UITableViewCell *) sender;
        NSIndexPath *indexPath = [self.tableView indexPathForCell:cell];
        MCCCalendar *calendar =[_calendars objectAtIndex:[indexPath row]];
        MCCCalendarViewController *controller = (MCCCalendarViewController *)segue.destinationViewController;
        controller.calendarItem= calendar;
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
