/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
    AxiosRequestConfig,
    OpenAPIClient,
    OperationResponse,
    Parameters,
    UnknownParamsObject
} from "openapi-client-axios";

declare namespace Components {
    namespace Schemas {
        export interface CreateFeedbackDto {
            rating: boolean;
            comment: string;
            trackVersionId: number;
            timestamp?: number;
        }

        export interface CreateUserDto {
            username: string;
            firstname: string;
            password: string;
            lastname: string;
            roles: {
                [key: string]: any;
            }[];
        }

        export interface GetFeedbackDto {
            id: number;
            createdAt: string; // date-time
            updatedAt: string; // date-time
            isPublished: boolean;
            rating: boolean;
            timestamp: number;
            trackVersionId: number;
            comment: string;
        }

        export interface GetFeedbackWithUserDto {
            id: number;
            createdAt: string; // date-time
            updatedAt: string; // date-time
            rating: boolean;
            comment: string;
            timestamp: number;
            user: GetUserDto;
        }

        export interface GetLabelDto {
            id: number;
            name: string;
            websiteUrl: string;
            description: string;
            genre: string;
            profilePicture: string;
        }

        export interface GetLabelMemberDto {
            id: number;
            status: "INVITED" | "ACCEPTED" | "DECLINED";
        }

        export interface GetLabelMemberWithLabelDto {
            id: number;
            status: "INVITED" | "ACCEPTED" | "DECLINED";
            label: GetLabelDto;
        }

        export interface GetReviewTrackDto {
            id: number;
            title: string;
            genre: string;
            trackversions: GetReviewTrackVersionDto[];
        }

        export interface GetReviewTrackVersionDto {
            id: number;
            createdAt: string; // date-time
            updatedAt: string; // date-time
            trackId: number;
            versionNumber: number;
            description: string;
            guid: string;
            filetype: string;
            fullUrl: string;
            duration: number;
            feedback: GetFeedbackDto[];
        }

        export interface GetReviewerDto {
            id: number;
            username: string;
            firstname: string;
            lastname: string;
            roles: {
                [key: string]: any;
            }[];
            isReviewed: boolean;
        }

        export interface GetTrackDeepDto {
            id: number;
            title: string;
            genre: string;
            trackversions: GetTrackVersionDeepDto[];
            reviewers: GetUserDto[];
        }

        export interface GetTrackDto {
            id: number;
            title: string;
            genre: string;
        }

        export interface GetTrackVersionDeepDto {
            id: number;
            createdAt: string; // date-time
            updatedAt: string; // date-time
            trackId: number;
            versionNumber: number;
            description: string;
            guid: string;
            filetype: string;
            fullUrl: string;
            duration: number;
            feedback: GetFeedbackWithUserDto[];
        }

        export interface GetTrackVersionDto {
            id: number;
            createdAt: string; // date-time
            updatedAt: string; // date-time
            trackId: number;
            versionNumber: number;
            description: string;
            guid: string;
            filetype: string;
            fullUrl: string;
            duration: number;
        }

        export interface GetTrackWithAuthorDto {
            id: number;
            title: string;
            genre: string;
            author: GetUserDto;
            status: (
                | "PENDING_REVIEW"
                | "READY_TO_REVIEW"
                | "REVIEWED"
                | "REVIEW_IN_PROGRESS"
                | "READY_TO_SEND"
                | "SEND"
            )[];
            label: GetLabelDto;
        }

        export interface GetTrackWithLabelOrReviewersAndAuthor {
            id: number;
            title: string;
            genre: string;
            trackversions: GetTrackVersionDto[];
            author: GetUserDto;
            reviewers: GetUserDto[];
            label: GetLabelDto;
        }

        export interface GetTrackWithReviewersDto {
            id: number;
            title: string;
            genre: string;
            author: GetUserDto;
            reviewers: GetReviewerDto[];
            status: (
                | "PENDING_REVIEW"
                | "READY_TO_REVIEW"
                | "REVIEWED"
                | "REVIEW_IN_PROGRESS"
                | "READY_TO_SEND"
                | "SEND"
            )[];
            trackversions: GetTrackVersionDto[];
        }

        export interface GetUserDto {
            id: number;
            username: string;
            firstname: string;
            lastname: string;
            roles: {
                [key: string]: any;
            }[];
        }

        export interface GetUserWithLabelMemberDto {
            id: number;
            firstname: string;
            lastname: string;
            username: string;
            roles: {
                [key: string]: any;
            }[];
            labelMember: GetLabelMemberDto[];
        }

        export interface GetUserWithNotificationsDto {
            id: number;
            username: string;
            firstname: string;
            lastname: string;
            roles: {
                [key: string]: any;
            }[];
            notifications: number;
        }

        export interface GetUserWithTrackDto {
            id: number;
            firstname: string;
            lastname: string;
            roles: {
                [key: string]: any;
            }[];
            tracks?: GetTrackDto[];
            feedback?: GetFeedbackDto[];
        }

        export interface InviteUserDto {
            userId: number;
        }

        export interface LoginDto {
            access_token: string;
        }

        export interface UpdateFeedbackDto {
            rating: boolean;
            comment: string;
            timestamp: number;
        }

        export interface UpdateLabelMemberStatusDto {
            labelMemberId: number;
        }

        export interface UpdateTrackDto {
            title: string;
            genre: string;
        }

        export interface UpdateTrackReviewersDto {
            reviewerIds: number[];
        }

        export interface UpdateUserDto {
            firstname: string;
            lastname: string;
        }

        export interface UpdateUserPasswordDto {
            password: string;
        }
    }
}
declare namespace Paths {
    namespace AppControllerGetProfile {
        namespace Responses {
            export type $200 = Components.Schemas.GetUserWithNotificationsDto;
        }
    }
    namespace AppControllerHello {
        namespace Responses {
            export type $200 = string;
        }
    }
    namespace AppControllerLogin {
        export interface RequestBody {
            username?: string;
            password?: string;
        }

        namespace Responses {
            export type $201 = Components.Schemas.LoginDto;
        }
    }
    namespace FeedbackControllerCreate {
        export type RequestBody = Components.Schemas.CreateFeedbackDto;
        namespace Responses {
            export type $201 = Components.Schemas.GetFeedbackDto;
        }
    }
    namespace FeedbackControllerPublishFeedback {
        namespace Parameters {
            export type TrackVersionId = number;
        }

        export interface PathParameters {
            trackVersionId: Parameters.TrackVersionId;
        }

        namespace Responses {
            export type $200 = Components.Schemas.GetFeedbackDto[];
        }
    }
    namespace FeedbackControllerRemove {
        namespace Parameters {
            export type Id = number;
        }

        export interface PathParameters {
            id: Parameters.Id;
        }

        namespace Responses {
            export interface $200 {}
        }
    }
    namespace FeedbackControllerUpdate {
        namespace Parameters {
            export type Id = number;
        }

        export interface PathParameters {
            id: Parameters.Id;
        }

        export type RequestBody = Components.Schemas.UpdateFeedbackDto;
        namespace Responses {
            export interface $200 {}
        }
    }
    namespace LabelsControllerAcceptInvite {
        namespace Parameters {
            export type Id = number;
        }

        export interface PathParameters {
            id: Parameters.Id;
        }

        export type RequestBody = Components.Schemas.UpdateLabelMemberStatusDto;
        namespace Responses {
            export interface $200 {}
        }
    }
    namespace LabelsControllerDeclineInvite {
        namespace Parameters {
            export type Id = number;
        }

        export interface PathParameters {
            id: Parameters.Id;
        }

        export type RequestBody = Components.Schemas.UpdateLabelMemberStatusDto;
        namespace Responses {
            export interface $200 {}
        }
    }
    namespace LabelsControllerGetAllTracksForLabel {
        namespace Parameters {
            export type Id = number;
        }

        export interface PathParameters {
            id: Parameters.Id;
        }

        namespace Responses {
            export type $200 = Components.Schemas.GetTrackWithReviewersDto[];
        }
    }
    namespace LabelsControllerGetAssignedLabels {
        namespace Responses {
            export type $200 = Components.Schemas.GetLabelDto[];
        }
    }
    namespace LabelsControllerGetAssignedReviewers {
        namespace Parameters {
            export type Id = number;
        }

        export interface PathParameters {
            id: Parameters.Id;
        }

        namespace Responses {
            export type $200 = Components.Schemas.GetUserWithLabelMemberDto[];
        }
    }
    namespace LabelsControllerGetAvailableReviewers {
        namespace Parameters {
            export type Id = number;
        }

        export interface PathParameters {
            id: Parameters.Id;
        }

        namespace Responses {
            export type $200 = Components.Schemas.GetUserDto[];
        }
    }
    namespace LabelsControllerGetInvites {
        namespace Responses {
            export type $200 = Components.Schemas.GetLabelMemberWithLabelDto[];
        }
    }
    namespace LabelsControllerGetLabelById {
        namespace Parameters {
            export type Id = number;
        }

        export interface PathParameters {
            id: Parameters.Id;
        }

        namespace Responses {
            export type $200 = Components.Schemas.GetLabelDto;
        }
    }
    namespace LabelsControllerGetLabelTypeahead {
        namespace Parameters {
            export type Query = string;
        }

        export interface PathParameters {
            query: Parameters.Query;
        }

        namespace Responses {
            export type $200 = Components.Schemas.GetLabelDto[];
        }
    }
    namespace LabelsControllerGetLabels {
        namespace Responses {
            export type $200 = Components.Schemas.GetLabelDto[];
        }
    }
    namespace LabelsControllerInviteUser {
        namespace Parameters {
            export type Id = number;
        }

        export interface PathParameters {
            id: Parameters.Id;
        }

        export type RequestBody = Components.Schemas.InviteUserDto;
        namespace Responses {
            export interface $201 {}
        }
    }
    namespace LabelsControllerRemoveReviewers {
        namespace Parameters {
            export type Id = number;
            export type LabelMemberId = number;
            export type ReviewerId = number;
        }

        export interface PathParameters {
            id: Parameters.Id;
            reviewerId: Parameters.ReviewerId;
            labelMemberId: Parameters.LabelMemberId;
        }

        namespace Responses {
            export interface $200 {}
        }
    }
    namespace TracksControllerAudio {
        namespace Parameters {
            export type Filename = string;
        }

        export interface PathParameters {
            filename: Parameters.Filename;
        }

        namespace Responses {
            export interface $200 {}
        }
    }
    namespace TracksControllerCreate {
        export interface RequestBody {
            title?: string;
            genre?: string;
            reviewerIds?: number[];
            labelId?: number;
            file?: string; // binary
        }

        namespace Responses {
            export type $201 = Components.Schemas.GetTrackWithLabelOrReviewersAndAuthor;
        }
    }
    namespace TracksControllerCreateNewVersion {
        namespace Parameters {
            export type TrackId = number;
        }

        export interface PathParameters {
            trackId: Parameters.TrackId;
        }

        export interface RequestBody {
            description?: string;
            file?: string; // binary
        }

        namespace Responses {
            export type $201 = Components.Schemas.GetTrackVersionDto;
        }
    }
    namespace TracksControllerDeleteTrackVersion {
        namespace Parameters {
            export type TrackversionId = number;
        }

        export interface PathParameters {
            trackversionId: Parameters.TrackversionId;
        }

        namespace Responses {
            export interface $200 {}
        }
    }
    namespace TracksControllerFindAll {
        namespace Responses {
            export type $200 = Components.Schemas.GetTrackWithAuthorDto[];
        }
    }
    namespace TracksControllerFindOne {
        namespace Parameters {
            export type Id = number;
        }

        export interface PathParameters {
            id: Parameters.Id;
        }

        namespace Responses {
            export type $200 = Components.Schemas.GetTrackDeepDto;
        }
    }
    namespace TracksControllerGetAssignedReviewers {
        namespace Parameters {
            export type Id = number;
        }

        export interface PathParameters {
            id: Parameters.Id;
        }

        namespace Responses {
            export type $200 = Components.Schemas.GetUserDto[];
        }
    }
    namespace TracksControllerGetReviewTrack {
        namespace Parameters {
            export type Id = number;
        }

        export interface PathParameters {
            id: Parameters.Id;
        }

        namespace Responses {
            export type $200 = Components.Schemas.GetReviewTrackDto;
        }
    }
    namespace TracksControllerPublishFeedback {
        namespace Parameters {
            export type TrackversionId = number;
        }

        export interface PathParameters {
            trackversionId: Parameters.TrackversionId;
        }

        namespace Responses {
            export interface $200 {}
        }
    }
    namespace TracksControllerRemove {
        namespace Parameters {
            export type Id = string;
        }

        export interface PathParameters {
            id: Parameters.Id;
        }

        namespace Responses {
            export type $200 = Components.Schemas.GetTrackDto;
        }
    }
    namespace TracksControllerRemoveReviewers {
        namespace Parameters {
            export type Id = number;
            export type ReviewerId = number;
        }

        export interface PathParameters {
            id: Parameters.Id;
            reviewerId: Parameters.ReviewerId;
        }

        namespace Responses {
            export interface $200 {}
        }
    }
    namespace TracksControllerUpdate {
        namespace Parameters {
            export type Id = string;
        }

        export interface PathParameters {
            id: Parameters.Id;
        }

        export type RequestBody = Components.Schemas.UpdateTrackDto;
        namespace Responses {
            export interface $200 {}
        }
    }
    namespace TracksControllerUpdateReviewers {
        namespace Parameters {
            export type Id = string;
        }

        export interface PathParameters {
            id: Parameters.Id;
        }

        export type RequestBody = Components.Schemas.UpdateTrackReviewersDto;
        namespace Responses {
            export type $200 = boolean;
        }
    }
    namespace UsersControllerCreate {
        export type RequestBody = Components.Schemas.CreateUserDto;
        namespace Responses {
            export interface $201 {}
        }
    }
    namespace UsersControllerFindAll {
        namespace Responses {
            export type $200 = Components.Schemas.GetUserWithTrackDto[];
        }
    }
    namespace UsersControllerGetReviewers {
        namespace Responses {
            export type $200 = Components.Schemas.GetUserDto[];
        }
    }
    namespace UsersControllerUpdate {
        export type RequestBody = Components.Schemas.UpdateUserDto;
        namespace Responses {
            export interface $200 {}
        }
    }
    namespace UsersControllerUpdatePassword {
        export type RequestBody = Components.Schemas.UpdateUserPasswordDto;
        namespace Responses {
            export interface $200 {}
        }
    }
}

export interface OperationMethods {
    /**
     * AppController_hello
     */
    "AppController_hello"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: any,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.AppControllerHello.Responses.$200>;

    /**
     * AppController_login
     */
    "AppController_login"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: Paths.AppControllerLogin.RequestBody,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.AppControllerLogin.Responses.$201>;

    /**
     * AppController_getProfile
     */
    "AppController_getProfile"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: any,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.AppControllerGetProfile.Responses.$200>;

    /**
     * TracksController_findAll
     */
    "TracksController_findAll"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: any,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.TracksControllerFindAll.Responses.$200>;

    /**
     * TracksController_create
     */
    "TracksController_create"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: Paths.TracksControllerCreate.RequestBody,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.TracksControllerCreate.Responses.$201>;

    /**
     * TracksController_createNewVersion
     */
    "TracksController_createNewVersion"(
        parameters?: Parameters<Paths.TracksControllerCreateNewVersion.PathParameters> | null,
        data?: Paths.TracksControllerCreateNewVersion.RequestBody,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.TracksControllerCreateNewVersion.Responses.$201>;

    /**
     * TracksController_audio
     */
    "TracksController_audio"(
        parameters?: Parameters<Paths.TracksControllerAudio.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.TracksControllerAudio.Responses.$200>;

    /**
     * TracksController_findOne
     */
    "TracksController_findOne"(
        parameters?: Parameters<Paths.TracksControllerFindOne.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.TracksControllerFindOne.Responses.$200>;

    /**
     * TracksController_remove
     */
    "TracksController_remove"(
        parameters?: Parameters<Paths.TracksControllerRemove.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.TracksControllerRemove.Responses.$200>;

    /**
     * TracksController_getReviewTrack
     */
    "TracksController_getReviewTrack"(
        parameters?: Parameters<Paths.TracksControllerGetReviewTrack.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.TracksControllerGetReviewTrack.Responses.$200>;

    /**
     * TracksController_getAssignedReviewers
     */
    "TracksController_getAssignedReviewers"(
        parameters?: Parameters<Paths.TracksControllerGetAssignedReviewers.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.TracksControllerGetAssignedReviewers.Responses.$200>;

    /**
     * TracksController_updateReviewers
     */
    "TracksController_updateReviewers"(
        parameters?: Parameters<Paths.TracksControllerUpdateReviewers.PathParameters> | null,
        data?: Paths.TracksControllerUpdateReviewers.RequestBody,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.TracksControllerUpdateReviewers.Responses.$200>;

    /**
     * TracksController_publishFeedback
     */
    "TracksController_publishFeedback"(
        parameters?: Parameters<Paths.TracksControllerPublishFeedback.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.TracksControllerPublishFeedback.Responses.$200>;

    /**
     * TracksController_deleteTrackVersion
     */
    "TracksController_deleteTrackVersion"(
        parameters?: Parameters<Paths.TracksControllerDeleteTrackVersion.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.TracksControllerDeleteTrackVersion.Responses.$200>;

    /**
     * TracksController_update
     */
    "TracksController_update"(
        parameters?: Parameters<Paths.TracksControllerUpdate.PathParameters> | null,
        data?: Paths.TracksControllerUpdate.RequestBody,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.TracksControllerUpdate.Responses.$200>;

    /**
     * TracksController_removeReviewers
     */
    "TracksController_removeReviewers"(
        parameters?: Parameters<Paths.TracksControllerRemoveReviewers.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.TracksControllerRemoveReviewers.Responses.$200>;

    /**
     * UsersController_findAll
     */
    "UsersController_findAll"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: any,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.UsersControllerFindAll.Responses.$200>;

    /**
     * UsersController_create
     */
    "UsersController_create"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: Paths.UsersControllerCreate.RequestBody,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.UsersControllerCreate.Responses.$201>;

    /**
     * UsersController_update
     */
    "UsersController_update"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: Paths.UsersControllerUpdate.RequestBody,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.UsersControllerUpdate.Responses.$200>;

    /**
     * UsersController_updatePassword
     */
    "UsersController_updatePassword"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: Paths.UsersControllerUpdatePassword.RequestBody,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.UsersControllerUpdatePassword.Responses.$200>;

    /**
     * UsersController_getReviewers
     */
    "UsersController_getReviewers"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: any,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.UsersControllerGetReviewers.Responses.$200>;

    /**
     * FeedbackController_create
     */
    "FeedbackController_create"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: Paths.FeedbackControllerCreate.RequestBody,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.FeedbackControllerCreate.Responses.$201>;

    /**
     * FeedbackController_update
     */
    "FeedbackController_update"(
        parameters?: Parameters<Paths.FeedbackControllerUpdate.PathParameters> | null,
        data?: Paths.FeedbackControllerUpdate.RequestBody,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.FeedbackControllerUpdate.Responses.$200>;

    /**
     * FeedbackController_remove
     */
    "FeedbackController_remove"(
        parameters?: Parameters<Paths.FeedbackControllerRemove.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.FeedbackControllerRemove.Responses.$200>;

    /**
     * FeedbackController_publishFeedback
     */
    "FeedbackController_publishFeedback"(
        parameters?: Parameters<Paths.FeedbackControllerPublishFeedback.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.FeedbackControllerPublishFeedback.Responses.$200>;

    /**
     * LabelsController_getLabels
     */
    "LabelsController_getLabels"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: any,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.LabelsControllerGetLabels.Responses.$200>;

    /**
     * LabelsController_getAssignedLabels
     */
    "LabelsController_getAssignedLabels"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: any,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.LabelsControllerGetAssignedLabels.Responses.$200>;

    /**
     * LabelsController_getInvites
     */
    "LabelsController_getInvites"(
        parameters?: Parameters<UnknownParamsObject> | null,
        data?: any,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.LabelsControllerGetInvites.Responses.$200>;

    /**
     * LabelsController_inviteUser
     */
    "LabelsController_inviteUser"(
        parameters?: Parameters<Paths.LabelsControllerInviteUser.PathParameters> | null,
        data?: Paths.LabelsControllerInviteUser.RequestBody,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.LabelsControllerInviteUser.Responses.$201>;

    /**
     * LabelsController_acceptInvite
     */
    "LabelsController_acceptInvite"(
        parameters?: Parameters<Paths.LabelsControllerAcceptInvite.PathParameters> | null,
        data?: Paths.LabelsControllerAcceptInvite.RequestBody,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.LabelsControllerAcceptInvite.Responses.$200>;

    /**
     * LabelsController_declineInvite
     */
    "LabelsController_declineInvite"(
        parameters?: Parameters<Paths.LabelsControllerDeclineInvite.PathParameters> | null,
        data?: Paths.LabelsControllerDeclineInvite.RequestBody,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.LabelsControllerDeclineInvite.Responses.$200>;

    /**
     * LabelsController_getLabelById
     */
    "LabelsController_getLabelById"(
        parameters?: Parameters<Paths.LabelsControllerGetLabelById.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.LabelsControllerGetLabelById.Responses.$200>;

    /**
     * LabelsController_getAllTracksForLabel
     */
    "LabelsController_getAllTracksForLabel"(
        parameters?: Parameters<Paths.LabelsControllerGetAllTracksForLabel.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.LabelsControllerGetAllTracksForLabel.Responses.$200>;

    /**
     * LabelsController_getAvailableReviewers
     */
    "LabelsController_getAvailableReviewers"(
        parameters?: Parameters<Paths.LabelsControllerGetAvailableReviewers.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.LabelsControllerGetAvailableReviewers.Responses.$200>;

    /**
     * LabelsController_getAssignedReviewers
     */
    "LabelsController_getAssignedReviewers"(
        parameters?: Parameters<Paths.LabelsControllerGetAssignedReviewers.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.LabelsControllerGetAssignedReviewers.Responses.$200>;

    /**
     * LabelsController_getLabelTypeahead
     */
    "LabelsController_getLabelTypeahead"(
        parameters?: Parameters<Paths.LabelsControllerGetLabelTypeahead.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.LabelsControllerGetLabelTypeahead.Responses.$200>;

    /**
     * LabelsController_removeReviewers
     */
    "LabelsController_removeReviewers"(
        parameters?: Parameters<Paths.LabelsControllerRemoveReviewers.PathParameters> | null,
        data?: any,
        config?: AxiosRequestConfig
    ): OperationResponse<Paths.LabelsControllerRemoveReviewers.Responses.$200>;
}

export interface PathsDictionary {
    ["/"]: {
        /**
         * AppController_hello
         */
        "get"(
            parameters?: Parameters<UnknownParamsObject> | null,
            data?: any,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.AppControllerHello.Responses.$200>;
    };
    ["/auth/login"]: {
        /**
         * AppController_login
         */
        "post"(
            parameters?: Parameters<UnknownParamsObject> | null,
            data?: Paths.AppControllerLogin.RequestBody,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.AppControllerLogin.Responses.$201>;
    };
    ["/profile"]: {
        /**
         * AppController_getProfile
         */
        "get"(
            parameters?: Parameters<UnknownParamsObject> | null,
            data?: any,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.AppControllerGetProfile.Responses.$200>;
    };
    ["/tracks"]: {
        /**
         * TracksController_create
         */
        "post"(
            parameters?: Parameters<UnknownParamsObject> | null,
            data?: Paths.TracksControllerCreate.RequestBody,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.TracksControllerCreate.Responses.$201>;
        /**
         * TracksController_findAll
         */
        "get"(
            parameters?: Parameters<UnknownParamsObject> | null,
            data?: any,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.TracksControllerFindAll.Responses.$200>;
    };
    ["/tracks/{trackId}"]: {
        /**
         * TracksController_createNewVersion
         */
        "post"(
            parameters?: Parameters<Paths.TracksControllerCreateNewVersion.PathParameters> | null,
            data?: Paths.TracksControllerCreateNewVersion.RequestBody,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.TracksControllerCreateNewVersion.Responses.$201>;
    };
    ["/tracks/audio/{filename}"]: {
        /**
         * TracksController_audio
         */
        "get"(
            parameters?: Parameters<Paths.TracksControllerAudio.PathParameters> | null,
            data?: any,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.TracksControllerAudio.Responses.$200>;
    };
    ["/tracks/{id}"]: {
        /**
         * TracksController_findOne
         */
        "get"(
            parameters?: Parameters<Paths.TracksControllerFindOne.PathParameters> | null,
            data?: any,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.TracksControllerFindOne.Responses.$200>;
        /**
         * TracksController_remove
         */
        "delete"(
            parameters?: Parameters<Paths.TracksControllerRemove.PathParameters> | null,
            data?: any,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.TracksControllerRemove.Responses.$200>;
    };
    ["/tracks/review/{id}"]: {
        /**
         * TracksController_getReviewTrack
         */
        "get"(
            parameters?: Parameters<Paths.TracksControllerGetReviewTrack.PathParameters> | null,
            data?: any,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.TracksControllerGetReviewTrack.Responses.$200>;
    };
    ["/tracks/{id}/assigned-reviewers"]: {
        /**
         * TracksController_getAssignedReviewers
         */
        "get"(
            parameters?: Parameters<Paths.TracksControllerGetAssignedReviewers.PathParameters> | null,
            data?: any,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.TracksControllerGetAssignedReviewers.Responses.$200>;
    };
    ["/tracks/{id}/reviewers"]: {
        /**
         * TracksController_updateReviewers
         */
        "patch"(
            parameters?: Parameters<Paths.TracksControllerUpdateReviewers.PathParameters> | null,
            data?: Paths.TracksControllerUpdateReviewers.RequestBody,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.TracksControllerUpdateReviewers.Responses.$200>;
    };
    ["/tracks/{trackversionId}/publish"]: {
        /**
         * TracksController_publishFeedback
         */
        "patch"(
            parameters?: Parameters<Paths.TracksControllerPublishFeedback.PathParameters> | null,
            data?: any,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.TracksControllerPublishFeedback.Responses.$200>;
    };
    ["/tracks/trackversion/{trackversionId}"]: {
        /**
         * TracksController_deleteTrackVersion
         */
        "delete"(
            parameters?: Parameters<Paths.TracksControllerDeleteTrackVersion.PathParameters> | null,
            data?: any,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.TracksControllerDeleteTrackVersion.Responses.$200>;
    };
    ["/tracks/{id}/update"]: {
        /**
         * TracksController_update
         */
        "patch"(
            parameters?: Parameters<Paths.TracksControllerUpdate.PathParameters> | null,
            data?: Paths.TracksControllerUpdate.RequestBody,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.TracksControllerUpdate.Responses.$200>;
    };
    ["/tracks/{id}/reviewers/{reviewerId}"]: {
        /**
         * TracksController_removeReviewers
         */
        "delete"(
            parameters?: Parameters<Paths.TracksControllerRemoveReviewers.PathParameters> | null,
            data?: any,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.TracksControllerRemoveReviewers.Responses.$200>;
    };
    ["/users"]: {
        /**
         * UsersController_create
         */
        "post"(
            parameters?: Parameters<UnknownParamsObject> | null,
            data?: Paths.UsersControllerCreate.RequestBody,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.UsersControllerCreate.Responses.$201>;
        /**
         * UsersController_findAll
         */
        "get"(
            parameters?: Parameters<UnknownParamsObject> | null,
            data?: any,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.UsersControllerFindAll.Responses.$200>;
        /**
         * UsersController_update
         */
        "patch"(
            parameters?: Parameters<UnknownParamsObject> | null,
            data?: Paths.UsersControllerUpdate.RequestBody,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.UsersControllerUpdate.Responses.$200>;
    };
    ["/users/Password"]: {
        /**
         * UsersController_updatePassword
         */
        "patch"(
            parameters?: Parameters<UnknownParamsObject> | null,
            data?: Paths.UsersControllerUpdatePassword.RequestBody,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.UsersControllerUpdatePassword.Responses.$200>;
    };
    ["/users/reviewers"]: {
        /**
         * UsersController_getReviewers
         */
        "get"(
            parameters?: Parameters<UnknownParamsObject> | null,
            data?: any,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.UsersControllerGetReviewers.Responses.$200>;
    };
    ["/feedback"]: {
        /**
         * FeedbackController_create
         */
        "post"(
            parameters?: Parameters<UnknownParamsObject> | null,
            data?: Paths.FeedbackControllerCreate.RequestBody,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.FeedbackControllerCreate.Responses.$201>;
    };
    ["/feedback/{id}"]: {
        /**
         * FeedbackController_update
         */
        "patch"(
            parameters?: Parameters<Paths.FeedbackControllerUpdate.PathParameters> | null,
            data?: Paths.FeedbackControllerUpdate.RequestBody,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.FeedbackControllerUpdate.Responses.$200>;
        /**
         * FeedbackController_remove
         */
        "delete"(
            parameters?: Parameters<Paths.FeedbackControllerRemove.PathParameters> | null,
            data?: any,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.FeedbackControllerRemove.Responses.$200>;
    };
    ["/feedback/publish/{trackVersionId}"]: {
        /**
         * FeedbackController_publishFeedback
         */
        "patch"(
            parameters?: Parameters<Paths.FeedbackControllerPublishFeedback.PathParameters> | null,
            data?: any,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.FeedbackControllerPublishFeedback.Responses.$200>;
    };
    ["/labels"]: {
        /**
         * LabelsController_getLabels
         */
        "get"(
            parameters?: Parameters<UnknownParamsObject> | null,
            data?: any,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.LabelsControllerGetLabels.Responses.$200>;
    };
    ["/labels/assigned"]: {
        /**
         * LabelsController_getAssignedLabels
         */
        "get"(
            parameters?: Parameters<UnknownParamsObject> | null,
            data?: any,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.LabelsControllerGetAssignedLabels.Responses.$200>;
    };
    ["/labels/invites"]: {
        /**
         * LabelsController_getInvites
         */
        "get"(
            parameters?: Parameters<UnknownParamsObject> | null,
            data?: any,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.LabelsControllerGetInvites.Responses.$200>;
    };
    ["/labels/{id}/invite"]: {
        /**
         * LabelsController_inviteUser
         */
        "post"(
            parameters?: Parameters<Paths.LabelsControllerInviteUser.PathParameters> | null,
            data?: Paths.LabelsControllerInviteUser.RequestBody,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.LabelsControllerInviteUser.Responses.$201>;
    };
    ["/labels/{id}/accept"]: {
        /**
         * LabelsController_acceptInvite
         */
        "patch"(
            parameters?: Parameters<Paths.LabelsControllerAcceptInvite.PathParameters> | null,
            data?: Paths.LabelsControllerAcceptInvite.RequestBody,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.LabelsControllerAcceptInvite.Responses.$200>;
    };
    ["/labels/{id}/decline"]: {
        /**
         * LabelsController_declineInvite
         */
        "patch"(
            parameters?: Parameters<Paths.LabelsControllerDeclineInvite.PathParameters> | null,
            data?: Paths.LabelsControllerDeclineInvite.RequestBody,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.LabelsControllerDeclineInvite.Responses.$200>;
    };
    ["/labels/{id}"]: {
        /**
         * LabelsController_getLabelById
         */
        "get"(
            parameters?: Parameters<Paths.LabelsControllerGetLabelById.PathParameters> | null,
            data?: any,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.LabelsControllerGetLabelById.Responses.$200>;
    };
    ["/labels/{id}/tracks"]: {
        /**
         * LabelsController_getAllTracksForLabel
         */
        "get"(
            parameters?: Parameters<Paths.LabelsControllerGetAllTracksForLabel.PathParameters> | null,
            data?: any,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.LabelsControllerGetAllTracksForLabel.Responses.$200>;
    };
    ["/labels/{id}/reviewers"]: {
        /**
         * LabelsController_getAvailableReviewers
         */
        "get"(
            parameters?: Parameters<Paths.LabelsControllerGetAvailableReviewers.PathParameters> | null,
            data?: any,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.LabelsControllerGetAvailableReviewers.Responses.$200>;
    };
    ["/labels/{id}/assigned-reviewers"]: {
        /**
         * LabelsController_getAssignedReviewers
         */
        "get"(
            parameters?: Parameters<Paths.LabelsControllerGetAssignedReviewers.PathParameters> | null,
            data?: any,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.LabelsControllerGetAssignedReviewers.Responses.$200>;
    };
    ["/labels/typeahead/{query}"]: {
        /**
         * LabelsController_getLabelTypeahead
         */
        "get"(
            parameters?: Parameters<Paths.LabelsControllerGetLabelTypeahead.PathParameters> | null,
            data?: any,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.LabelsControllerGetLabelTypeahead.Responses.$200>;
    };
    ["/labels/{id}/reviewers/{reviewerId}/{labelMemberId}"]: {
        /**
         * LabelsController_removeReviewers
         */
        "delete"(
            parameters?: Parameters<Paths.LabelsControllerRemoveReviewers.PathParameters> | null,
            data?: any,
            config?: AxiosRequestConfig
        ): OperationResponse<Paths.LabelsControllerRemoveReviewers.Responses.$200>;
    };
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>;
