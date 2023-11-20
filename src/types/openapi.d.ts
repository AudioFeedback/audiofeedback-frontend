import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios';

declare namespace Components {
    namespace Schemas {
        export interface CreateFeedbackDto {
            rating: boolean;
            comment: string;
            trackId: number;
            timestamp: number;
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
            rating: boolean;
            timestamp: number;
            trackId: number;
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
        export interface GetTrackWithAuthorAndReviewersDto {
            id: number;
            title: string;
            genre: string;
            trackversions: GetTrackVersionDto[];
            author: GetUserDto;
            reviewers: GetUserDto[];
        }
        export interface GetTrackWithAuthorDto {
            id: number;
            title: string;
            genre: string;
            trackversions: GetTrackVersionDto[];
            author: GetUserDto;
        }
        export interface GetTrackWithTrackVersionsDto {
            id: number;
            title: string;
            genre: string;
            trackversions: GetTrackVersionDto[];
            author: GetUserDto;
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
        export interface LoginDto {
            access_token: string;
        }
        export interface UpdateFeedbackDto {
            rating?: boolean;
            comment?: string;
            trackId?: number;
            timestamp?: number;
        }
        export interface UpdateUserDto {
            username?: string;
            firstname?: string;
            password?: string;
            lastname?: string;
            roles?: {
                [key: string]: any;
            }[];
        }
    }
}
declare namespace Paths {
    namespace AppControllerGetProfile {
        namespace Responses {
            export type $200 = Components.Schemas.GetUserDto;
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
    namespace FeedbackControllerFindAll {
        namespace Responses {
            export type $200 = Components.Schemas.GetFeedbackDto[];
        }
    }
    namespace FeedbackControllerFindOne {
        namespace Parameters {
            export type Id = number;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export type $200 = string;
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
            export interface $200 {
            }
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
            export interface $200 {
            }
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
            export interface $200 {
            }
        }
    }
    namespace TracksControllerCreate {
        export interface RequestBody {
            title?: string;
            genre?: string;
            reviewerIds?: number[];
            file?: string; // binary
        }
        namespace Responses {
            export type $201 = Components.Schemas.GetTrackWithAuthorAndReviewersDto;
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
    namespace TracksControllerFindAll {
        namespace Responses {
            export type $200 = Components.Schemas.GetTrackWithTrackVersionsDto[];
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
    namespace TracksControllerGetReviewable {
        namespace Responses {
            export type $200 = Components.Schemas.GetTrackWithAuthorDto[];
        }
    }
    namespace UsersControllerCreate {
        export type RequestBody = Components.Schemas.CreateUserDto;
        namespace Responses {
            export interface $201 {
            }
        }
    }
    namespace UsersControllerFindAll {
        namespace Responses {
            export type $200 = Components.Schemas.GetUserWithTrackDto[];
        }
    }
    namespace UsersControllerFindOne {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export interface $200 {
            }
        }
    }
    namespace UsersControllerGetReviewers {
        namespace Responses {
            export type $200 = Components.Schemas.GetUserDto[];
        }
    }
    namespace UsersControllerRemove {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        namespace Responses {
            export type $200 = string;
        }
    }
    namespace UsersControllerUpdate {
        namespace Parameters {
            export type Id = string;
        }
        export interface PathParameters {
            id: Parameters.Id;
        }
        export type RequestBody = Components.Schemas.UpdateUserDto;
        namespace Responses {
            export type $200 = string;
        }
    }
}

export interface OperationMethods {
  /**
   * AppController_hello
   */
  'AppController_hello'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.AppControllerHello.Responses.$200>
  /**
   * AppController_login
   */
  'AppController_login'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AppControllerLogin.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.AppControllerLogin.Responses.$201>
  /**
   * AppController_getProfile
   */
  'AppController_getProfile'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.AppControllerGetProfile.Responses.$200>
  /**
   * TracksController_findAll
   */
  'TracksController_findAll'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.TracksControllerFindAll.Responses.$200>
  /**
   * TracksController_create
   */
  'TracksController_create'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.TracksControllerCreate.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.TracksControllerCreate.Responses.$201>
  /**
   * TracksController_createNewVersion
   */
  'TracksController_createNewVersion'(
    parameters?: Parameters<Paths.TracksControllerCreateNewVersion.PathParameters> | null,
    data?: Paths.TracksControllerCreateNewVersion.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.TracksControllerCreateNewVersion.Responses.$201>
  /**
   * TracksController_audio
   */
  'TracksController_audio'(
    parameters?: Parameters<Paths.TracksControllerAudio.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.TracksControllerAudio.Responses.$200>
  /**
   * TracksController_findOne
   */
  'TracksController_findOne'(
    parameters?: Parameters<Paths.TracksControllerFindOne.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.TracksControllerFindOne.Responses.$200>
  /**
   * TracksController_getReviewable
   */
  'TracksController_getReviewable'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.TracksControllerGetReviewable.Responses.$200>
  /**
   * UsersController_findAll
   */
  'UsersController_findAll'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.UsersControllerFindAll.Responses.$200>
  /**
   * UsersController_create
   */
  'UsersController_create'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.UsersControllerCreate.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.UsersControllerCreate.Responses.$201>
  /**
   * UsersController_findOne
   */
  'UsersController_findOne'(
    parameters?: Parameters<Paths.UsersControllerFindOne.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.UsersControllerFindOne.Responses.$200>
  /**
   * UsersController_update
   */
  'UsersController_update'(
    parameters?: Parameters<Paths.UsersControllerUpdate.PathParameters> | null,
    data?: Paths.UsersControllerUpdate.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.UsersControllerUpdate.Responses.$200>
  /**
   * UsersController_remove
   */
  'UsersController_remove'(
    parameters?: Parameters<Paths.UsersControllerRemove.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.UsersControllerRemove.Responses.$200>
  /**
   * UsersController_getReviewers
   */
  'UsersController_getReviewers'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.UsersControllerGetReviewers.Responses.$200>
  /**
   * FeedbackController_findAll
   */
  'FeedbackController_findAll'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.FeedbackControllerFindAll.Responses.$200>
  /**
   * FeedbackController_create
   */
  'FeedbackController_create'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.FeedbackControllerCreate.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.FeedbackControllerCreate.Responses.$201>
  /**
   * FeedbackController_findOne
   */
  'FeedbackController_findOne'(
    parameters?: Parameters<Paths.FeedbackControllerFindOne.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.FeedbackControllerFindOne.Responses.$200>
  /**
   * FeedbackController_update
   */
  'FeedbackController_update'(
    parameters?: Parameters<Paths.FeedbackControllerUpdate.PathParameters> | null,
    data?: Paths.FeedbackControllerUpdate.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.FeedbackControllerUpdate.Responses.$200>
  /**
   * FeedbackController_remove
   */
  'FeedbackController_remove'(
    parameters?: Parameters<Paths.FeedbackControllerRemove.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.FeedbackControllerRemove.Responses.$200>
}

export interface PathsDictionary {
  ['/']: {
    /**
     * AppController_hello
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.AppControllerHello.Responses.$200>
  }
  ['/auth/login']: {
    /**
     * AppController_login
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AppControllerLogin.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.AppControllerLogin.Responses.$201>
  }
  ['/profile']: {
    /**
     * AppController_getProfile
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.AppControllerGetProfile.Responses.$200>
  }
  ['/tracks']: {
    /**
     * TracksController_create
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.TracksControllerCreate.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.TracksControllerCreate.Responses.$201>
    /**
     * TracksController_findAll
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.TracksControllerFindAll.Responses.$200>
  }
  ['/tracks/{trackId}']: {
    /**
     * TracksController_createNewVersion
     */
    'post'(
      parameters?: Parameters<Paths.TracksControllerCreateNewVersion.PathParameters> | null,
      data?: Paths.TracksControllerCreateNewVersion.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.TracksControllerCreateNewVersion.Responses.$201>
  }
  ['/tracks/audio/{filename}']: {
    /**
     * TracksController_audio
     */
    'get'(
      parameters?: Parameters<Paths.TracksControllerAudio.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.TracksControllerAudio.Responses.$200>
  }
  ['/tracks/{id}']: {
    /**
     * TracksController_findOne
     */
    'get'(
      parameters?: Parameters<Paths.TracksControllerFindOne.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.TracksControllerFindOne.Responses.$200>
  }
  ['/tracks/reviewer/reviewable']: {
    /**
     * TracksController_getReviewable
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.TracksControllerGetReviewable.Responses.$200>
  }
  ['/users']: {
    /**
     * UsersController_create
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.UsersControllerCreate.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.UsersControllerCreate.Responses.$201>
    /**
     * UsersController_findAll
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.UsersControllerFindAll.Responses.$200>
  }
  ['/users/{id}']: {
    /**
     * UsersController_findOne
     */
    'get'(
      parameters?: Parameters<Paths.UsersControllerFindOne.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.UsersControllerFindOne.Responses.$200>
    /**
     * UsersController_update
     */
    'patch'(
      parameters?: Parameters<Paths.UsersControllerUpdate.PathParameters> | null,
      data?: Paths.UsersControllerUpdate.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.UsersControllerUpdate.Responses.$200>
    /**
     * UsersController_remove
     */
    'delete'(
      parameters?: Parameters<Paths.UsersControllerRemove.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.UsersControllerRemove.Responses.$200>
  }
  ['/users/reviewers']: {
    /**
     * UsersController_getReviewers
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.UsersControllerGetReviewers.Responses.$200>
  }
  ['/feedback']: {
    /**
     * FeedbackController_create
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.FeedbackControllerCreate.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.FeedbackControllerCreate.Responses.$201>
    /**
     * FeedbackController_findAll
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.FeedbackControllerFindAll.Responses.$200>
  }
  ['/feedback/{id}']: {
    /**
     * FeedbackController_findOne
     */
    'get'(
      parameters?: Parameters<Paths.FeedbackControllerFindOne.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.FeedbackControllerFindOne.Responses.$200>
    /**
     * FeedbackController_update
     */
    'patch'(
      parameters?: Parameters<Paths.FeedbackControllerUpdate.PathParameters> | null,
      data?: Paths.FeedbackControllerUpdate.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.FeedbackControllerUpdate.Responses.$200>
    /**
     * FeedbackController_remove
     */
    'delete'(
      parameters?: Parameters<Paths.FeedbackControllerRemove.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.FeedbackControllerRemove.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
