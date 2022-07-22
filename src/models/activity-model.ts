
import randomNumberTimeBased from '@shared/constants/randomGenerator.utility';
import IdbItemBase from './shared/dbItemBase';
import {
    ActivityStatus,
    ActivityUserMapStatus,
    SkillLevel,
    userType,
    WeekDays
} from './shared/enums';

// Activity schema
export interface IActivity extends IdbItemBase {
    endeavourPk: string;

    title: string;
    StartDate: Date;
    endDate: Date;
    /** 24 hour format */
    startTime: number;
    /** 24 hour format */
    endTime: number;

    status: ActivityStatus;

    description?: string;

    locationPk: string;

    Weekdays: WeekDays[];

    IsInviteOnly?: boolean;

    SkillStartLevel: SkillLevel,

    SkillEndLevel?: SkillLevel,

    AgeStartLevel?: number,

    AgeEndLevel?: number,

    Media?: {
        mainPicUrl: string,
        OtherPicUrls: string,
    },

    MaxTraineeAllowed?: number,
}

export const getActivityPk = (suffix: string) => {
    return randomNumberTimeBased(suffix);
}

export const getActivitySk = (activityPk: string) => {
    return activityPk;
}

/**
 * User Activity Map Schema
 */
export interface IActivityUserMap extends IdbItemBase {
    isCreator?: boolean;
    type: userType;
    currentStatus: ActivityUserMapStatus;
    addDate: Date;
    removeDate?: Date;
    lastStatus?: ActivityUserMapStatus;
}

/**
 * Get a new Activity object.
 * @returns 
 */
function getNew(name: string): IActivity {
    return {
        pk: '',
        sk: '',
        title: name,
        StartDate: new Date(),
        endDate: new Date(),
        startTime: 9,
        endTime: 10,
        status: ActivityStatus.Active,
        SkillStartLevel: SkillLevel.Advance,
        endeavourPk: '',
        IsInviteOnly: false,
        Weekdays: [WeekDays.Fri],
        locationPk: ''
    };
}

/**
 * Copy a Activity object.
 * @param Activity 
 * @returns 
 */
function copy(Activity: IActivity): IActivity {
    return {
        ...Activity
    }
}

// Export default
export default {
    new: getNew,
    copy,
}
