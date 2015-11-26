//
//  MCCEventViewController.m
//  Cloud calendar
//
//  Created by Roman Filippov on 23/11/15.
//  Copyright © 2015 MCC. All rights reserved.
//

#import "MCCEventViewController.h"

@interface MCCEventViewController ()

@property (nonatomic, weak) IBOutlet UITextView *textView;

@end

@implementation MCCEventViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    NSString *evenInfo = [NSString stringWithFormat:@"Title: %@\nDescription: %@\nLocation: %@\nStartTime: %@\nEndTime: %@",_eventItem.__title,_eventItem.__description,_eventItem.__location,_eventItem.__startTime,_eventItem.__endTime];
    
    self.textView.text = evenInfo;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
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
