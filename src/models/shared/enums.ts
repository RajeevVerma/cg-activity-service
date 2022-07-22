
export enum userType {
    Trainee,
    Guru,
    Owner,
    Moderator,
    CoGuru,
    Admin
}

export enum DayType {
    AllWeekends,
    AllWeekdays,
    AlternateDayWeekDays,
    CustomSelectedWeekdays,
}

export enum ActivityStatus {
    Active,
    InActive,
    Deleted
}

export enum WeekDays {
    Sun,
    Mon,
    Tue,
    Wed,
    Thur,
    Fri,
    Sat
}

export enum SkillLevel {
    Beginner,
    Intermediate,
    Advance,
    Professional
}

export enum ActivityUserMapStatus {
    Unknown,
    RequestedByTrainee,
    InvitedByGuru,
    Pending,
    Active,
    Removed
}