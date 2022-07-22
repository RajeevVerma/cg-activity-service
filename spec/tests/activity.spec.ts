import supertest from 'supertest';
import StatusCodes from 'http-status-codes';
import { SuperTest, Test, Response } from 'supertest';

import app from '@server';
import userRepo from '@repos/activity-repo';
import Activity, { IActivity } from '@models/activity-model';
import { pErr } from '@shared/functions';
import { p as userPaths } from '@routes/activity-router';
import { ParamMissingError, UserNotFoundError } from '@shared/errors';

type TReqBody = string | object | undefined;

describe('activity-router', () => {

    const activitiesPath = '/api/activities';
    const getActivitiesPath = `${activitiesPath}${userPaths.get}`;
    const addActivitiesPath = `${activitiesPath}${userPaths.add}`;
    const updateUserPath = `${activitiesPath}${userPaths.update}`;
    const deleteUserPath = `${activitiesPath}${userPaths.delete}`;

    const { BAD_REQUEST, CREATED, OK } = StatusCodes;
    let agent: SuperTest<Test>;

    beforeAll((done) => {
        agent = supertest.agent(app);
        done();
    });

    /***********************************************************************************
     *                                    Test Get
     **********************************************************************************/

    describe(`"GET:${getActivitiesPath}"`, () => {

        it(`should return a JSON object with all the activities and a status code of "${OK}" if the
            request was successful.`, (done) => {
            // Setup spy
            const activities = [
                Activity.new('Sean Maxwell'),
                Activity.new('John Smith'),
                Activity.new('Gordan Freeman'),
            ];
            spyOn(userRepo, 'getAll').and.returnValue(Promise.resolve(activities));
            // Call API
            agent.get(getActivitiesPath)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    // Caste instance-objects to 'User' objects
                    const respActivities = res.body.activities as IActivity[];
                    const retActivities: IActivity[] = respActivities.map((user: IActivity) => {
                        return Activity.copy(user);
                    });
                    expect(retActivities).toEqual(activities);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object containing an error message and a status code of
            "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {
            // Setup spy
            const errMsg = 'Could not fetch activities.';
            spyOn(userRepo, 'getAll').and.throwError(errMsg);
            // Call API
            agent.get(getActivitiesPath)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    console.log(res.body)
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(errMsg);
                    done();
                });
        });
    });


    /***********************************************************************************
     *                                    Test Post
     **********************************************************************************/

    describe(`"POST:${addActivitiesPath}"`, () => {

        const callApi = (reqBody: TReqBody) => {
            return agent.post(addActivitiesPath).type('form').send(reqBody);
        };
        const userData = {
            user: Activity.new('Gordan Freeman'),
        };

        it(`should return a status code of "${CREATED}" if the request was successful.`, (done) => {
            // Setup Spy
            spyOn(userRepo, 'add').and.returnValue(Promise.resolve());
            // Call API
            agent.post(addActivitiesPath).type('form').send(userData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(CREATED);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object with an error message of 
            "${ParamMissingError.Msg}" and a status
            code of "${BAD_REQUEST}" if the user param was missing.`, (done) => {
            // Call API
            callApi({})
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(ParamMissingError.Msg);
                    done();
                });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            // Setup spy
            const errMsg = 'Could not add user.';
            spyOn(userRepo, 'add').and.throwError(errMsg);
            // Call API
            callApi(userData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(errMsg);
                    done();
                });
        });
    });


    /***********************************************************************************
     *                                    Test Put
     **********************************************************************************/

    describe(`"PUT:${updateUserPath}"`, () => {

        const callApi = (reqBody: TReqBody) => {
            return agent.put(updateUserPath).type('form').send(reqBody);
        };
        const userData = {
            user: Activity.new('Gordan Freeman'),
        };

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
            // Setup spy
            spyOn(userRepo, 'persists').and.returnValue(Promise.resolve(true));
            spyOn(userRepo, 'update').and.returnValue(Promise.resolve());
            // Call Api
            callApi(userData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object with an error message of "${ParamMissingError.Msg}" and a
            status code of "${BAD_REQUEST}" if the user param was missing.`, (done) => {
            // Call api
            callApi({})
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(ParamMissingError.Msg);
                    done();
                });
        });

        it(`should return a JSON object with the error message of ${UserNotFoundError.Msg} 
            and a status code of "${StatusCodes.NOT_FOUND}" if the id was not found.`, (done) => {
            // Call api
            callApi(userData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(UserNotFoundError.HttpStatus);
                    expect(res.body.error).toBe(UserNotFoundError.Msg);
                    done();
                });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            spyOn(userRepo, 'persists').and.returnValue(Promise.resolve(true));
            // Setup spy
            const updateErrMsg = 'Could not update user.';
            spyOn(userRepo, 'update').and.throwError(updateErrMsg);
            // Call API
            callApi(userData)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(updateErrMsg);
                    done();
                });
        });
    });


    /***********************************************************************************
     *                                    Test Delete
     **********************************************************************************/

    describe(`"DELETE:${deleteUserPath}"`, () => {

        const callApi = (id: number) => {
            return agent.delete(deleteUserPath.replace(':id', id.toString()));
        };

        it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
            // Setup spy
            spyOn(userRepo, 'persists').and.returnValue(Promise.resolve(true));
            spyOn(userRepo, 'delete').and.returnValue(Promise.resolve());
            // Call api
            callApi(5)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        });

        it(`should return a JSON object with the error message of ${UserNotFoundError.Msg} 
            and a status code of "${StatusCodes.NOT_FOUND}" if the id was not found.`, (done) => {
            // Call api
            callApi(-1)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(StatusCodes.NOT_FOUND);
                    expect(res.body.error).toBe(UserNotFoundError.Msg);
                    done();
                });
        });

        it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {
            spyOn(userRepo, 'persists').and.returnValue(Promise.resolve(true));
            // Setup spy
            const deleteErrMsg = 'Could not delete user.';
            spyOn(userRepo, 'delete').and.throwError(deleteErrMsg);
            // Call Api
            callApi(1)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(deleteErrMsg);
                    done();
                });
        });
    });
});
