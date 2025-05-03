import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type CreateProblemInput = {
  description: Scalars['String']['input'];
  difficulty: ProblemDifficulty;
  editorial?: InputMaybe<EditorialInput>;
  examples: Array<ExampleInput>;
  hints?: InputMaybe<Array<Scalars['String']['input']>>;
  memoryLimitInMB: Scalars['Int']['input'];
  slug: Scalars['String']['input'];
  solutions?: InputMaybe<Array<SolutionInput>>;
  timeLimitInSeconds: Scalars['Int']['input'];
  title: Scalars['String']['input'];
  topics: Array<Scalars['ID']['input']>;
};

export type Discussion = {
  __typename?: 'Discussion';
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  parent?: Maybe<Discussion>;
  problem?: Maybe<Problem>;
  problemId?: Maybe<Scalars['ID']['output']>;
  replies?: Maybe<Array<Maybe<Discussion>>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
  userId?: Maybe<Scalars['ID']['output']>;
};

export type Editorial = {
  __typename?: 'Editorial';
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  dislikes?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  likes?: Maybe<Scalars['Int']['output']>;
  problem?: Maybe<Problem>;
  problemId?: Maybe<Scalars['ID']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  views?: Maybe<Scalars['Int']['output']>;
};

export type EditorialInput = {
  content: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type Example = {
  __typename?: 'Example';
  explanation?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  input?: Maybe<Scalars['String']['output']>;
  output?: Maybe<Scalars['String']['output']>;
  problemId?: Maybe<Scalars['ID']['output']>;
};

export type ExampleInput = {
  explanation?: InputMaybe<Scalars['String']['input']>;
  input: Scalars['String']['input'];
  output: Scalars['String']['input'];
};

export type GenericResponse = {
  __typename?: 'GenericResponse';
  isSuccess: Scalars['Boolean']['output'];
  message?: Maybe<Scalars['String']['output']>;
};

export type GetAllProblemsFilterInput = {
  difficulty?: InputMaybe<ProblemDifficulty>;
  search?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
  topics?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type GetAllProblemsResponse = {
  __typename?: 'GetAllProblemsResponse';
  edges?: Maybe<Array<Maybe<Problem>>>;
  pageInfo?: Maybe<PageInfo>;
};

export type Hint = {
  __typename?: 'Hint';
  content?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  problemId?: Maybe<Scalars['ID']['output']>;
};

export type LikeDislikeInput = {
  entityId: Scalars['ID']['input'];
  like: Scalars['Boolean']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createProblem?: Maybe<Problem>;
  deleteProblem?: Maybe<GenericResponse>;
  likeDislikeProblem?: Maybe<GenericResponse>;
  updateProblem?: Maybe<Problem>;
  updateProfile?: Maybe<User>;
};


export type MutationCreateProblemArgs = {
  input?: InputMaybe<CreateProblemInput>;
};


export type MutationDeleteProblemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLikeDislikeProblemArgs = {
  input?: InputMaybe<LikeDislikeInput>;
};


export type MutationUpdateProblemArgs = {
  input?: InputMaybe<UpdateProblemInput>;
};


export type MutationUpdateProfileArgs = {
  input?: InputMaybe<UpdateProfileInput>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  currentPage: Scalars['Int']['output'];
  fetchedCount: Scalars['Int']['output'];
  hasNextPage: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Problem = {
  __typename?: 'Problem';
  acceptedSubmissions?: Maybe<Scalars['Int']['output']>;
  bookmarks?: Maybe<Scalars['Int']['output']>;
  createdBy?: Maybe<User>;
  createdById?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  difficulty?: Maybe<ProblemDifficulty>;
  discussions?: Maybe<Array<Maybe<Discussion>>>;
  dislikes?: Maybe<Scalars['Int']['output']>;
  editorial?: Maybe<Editorial>;
  examples?: Maybe<Array<Maybe<Example>>>;
  hints?: Maybe<Array<Maybe<Hint>>>;
  id: Scalars['ID']['output'];
  likes?: Maybe<Scalars['Int']['output']>;
  memoryLimitInMB?: Maybe<Scalars['Int']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  solutions?: Maybe<Array<Maybe<Solution>>>;
  timeLimitInSeconds?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  topics?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  totalSubmissions?: Maybe<Scalars['Int']['output']>;
  userSolutions?: Maybe<Array<Maybe<UserSolution>>>;
  views?: Maybe<Scalars['Int']['output']>;
};

export enum ProblemDifficulty {
  Easy = 'EASY',
  Hard = 'HARD',
  Medium = 'MEDIUM'
}

export type Query = {
  __typename?: 'Query';
  problem?: Maybe<Problem>;
  problems?: Maybe<GetAllProblemsResponse>;
  profile?: Maybe<User>;
  user?: Maybe<User>;
  userSolution?: Maybe<UserSolution>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryProblemArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryProblemsArgs = {
  filters?: InputMaybe<GetAllProblemsFilterInput>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserSolutionArgs = {
  id: Scalars['ID']['input'];
};

export enum Role {
  Admin = 'ADMIN',
  Moderator = 'MODERATOR',
  User = 'USER'
}

export type Session = {
  __typename?: 'Session';
  createdAt?: Maybe<Scalars['String']['output']>;
  expires?: Maybe<Scalars['String']['output']>;
  sessionToken?: Maybe<Scalars['ID']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['ID']['output']>;
};

export type Solution = {
  __typename?: 'Solution';
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  language?: Maybe<Scalars['String']['output']>;
  problemId?: Maybe<Scalars['ID']['output']>;
};

export type SolutionInput = {
  code: Scalars['String']['input'];
  language: Scalars['String']['input'];
};

export type UpdateProblemInput = {
  description: Scalars['String']['input'];
  difficulty: ProblemDifficulty;
  examples: Array<ExampleInput>;
  hints: Array<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  memoryLimitInMB: Scalars['Int']['input'];
  slug: Scalars['String']['input'];
  solutions: Array<SolutionInput>;
  timeLimitInSeconds: Scalars['Int']['input'];
  title: Scalars['String']['input'];
  topics: Array<Scalars['String']['input']>;
};

export type UpdateProfileInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']['output']>;
  emailVerified?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Role>;
  sessions?: Maybe<Array<Maybe<Session>>>;
};

export type UserSolution = {
  __typename?: 'UserSolution';
  authorId?: Maybe<Scalars['ID']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  dislikes?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  likes?: Maybe<Scalars['Int']['output']>;
  problem?: Maybe<Problem>;
  problemId?: Maybe<Scalars['ID']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  user?: Maybe<User>;
  views?: Maybe<Scalars['Int']['output']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateProblemInput: CreateProblemInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Discussion: ResolverTypeWrapper<Discussion>;
  Editorial: ResolverTypeWrapper<Editorial>;
  EditorialInput: EditorialInput;
  Example: ResolverTypeWrapper<Example>;
  ExampleInput: ExampleInput;
  GenericResponse: ResolverTypeWrapper<GenericResponse>;
  GetAllProblemsFilterInput: GetAllProblemsFilterInput;
  GetAllProblemsResponse: ResolverTypeWrapper<GetAllProblemsResponse>;
  Hint: ResolverTypeWrapper<Hint>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  LikeDislikeInput: LikeDislikeInput;
  Mutation: ResolverTypeWrapper<{}>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Problem: ResolverTypeWrapper<Problem>;
  ProblemDifficulty: ProblemDifficulty;
  Query: ResolverTypeWrapper<{}>;
  Role: Role;
  Session: ResolverTypeWrapper<Session>;
  Solution: ResolverTypeWrapper<Solution>;
  SolutionInput: SolutionInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateProblemInput: UpdateProblemInput;
  UpdateProfileInput: UpdateProfileInput;
  User: ResolverTypeWrapper<User>;
  UserSolution: ResolverTypeWrapper<UserSolution>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  CreateProblemInput: CreateProblemInput;
  DateTime: Scalars['DateTime']['output'];
  Discussion: Discussion;
  Editorial: Editorial;
  EditorialInput: EditorialInput;
  Example: Example;
  ExampleInput: ExampleInput;
  GenericResponse: GenericResponse;
  GetAllProblemsFilterInput: GetAllProblemsFilterInput;
  GetAllProblemsResponse: GetAllProblemsResponse;
  Hint: Hint;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  LikeDislikeInput: LikeDislikeInput;
  Mutation: {};
  PageInfo: PageInfo;
  Problem: Problem;
  Query: {};
  Session: Session;
  Solution: Solution;
  SolutionInput: SolutionInput;
  String: Scalars['String']['output'];
  UpdateProblemInput: UpdateProblemInput;
  UpdateProfileInput: UpdateProfileInput;
  User: User;
  UserSolution: UserSolution;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DiscussionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Discussion'] = ResolversParentTypes['Discussion']> = {
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['Discussion']>, ParentType, ContextType>;
  problem?: Resolver<Maybe<ResolversTypes['Problem']>, ParentType, ContextType>;
  problemId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  replies?: Resolver<Maybe<Array<Maybe<ResolversTypes['Discussion']>>>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EditorialResolvers<ContextType = any, ParentType extends ResolversParentTypes['Editorial'] = ResolversParentTypes['Editorial']> = {
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  dislikes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  likes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  problem?: Resolver<Maybe<ResolversTypes['Problem']>, ParentType, ContextType>;
  problemId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  views?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExampleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Example'] = ResolversParentTypes['Example']> = {
  explanation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  input?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  output?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  problemId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GenericResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['GenericResponse'] = ResolversParentTypes['GenericResponse']> = {
  isSuccess?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GetAllProblemsResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['GetAllProblemsResponse'] = ResolversParentTypes['GetAllProblemsResponse']> = {
  edges?: Resolver<Maybe<Array<Maybe<ResolversTypes['Problem']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<Maybe<ResolversTypes['PageInfo']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HintResolvers<ContextType = any, ParentType extends ResolversParentTypes['Hint'] = ResolversParentTypes['Hint']> = {
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  problemId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createProblem?: Resolver<Maybe<ResolversTypes['Problem']>, ParentType, ContextType, Partial<MutationCreateProblemArgs>>;
  deleteProblem?: Resolver<Maybe<ResolversTypes['GenericResponse']>, ParentType, ContextType, RequireFields<MutationDeleteProblemArgs, 'id'>>;
  likeDislikeProblem?: Resolver<Maybe<ResolversTypes['GenericResponse']>, ParentType, ContextType, Partial<MutationLikeDislikeProblemArgs>>;
  updateProblem?: Resolver<Maybe<ResolversTypes['Problem']>, ParentType, ContextType, Partial<MutationUpdateProblemArgs>>;
  updateProfile?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, Partial<MutationUpdateProfileArgs>>;
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  currentPage?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  fetchedCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalPages?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProblemResolvers<ContextType = any, ParentType extends ResolversParentTypes['Problem'] = ResolversParentTypes['Problem']> = {
  acceptedSubmissions?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  bookmarks?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  createdBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  createdById?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  difficulty?: Resolver<Maybe<ResolversTypes['ProblemDifficulty']>, ParentType, ContextType>;
  discussions?: Resolver<Maybe<Array<Maybe<ResolversTypes['Discussion']>>>, ParentType, ContextType>;
  dislikes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  editorial?: Resolver<Maybe<ResolversTypes['Editorial']>, ParentType, ContextType>;
  examples?: Resolver<Maybe<Array<Maybe<ResolversTypes['Example']>>>, ParentType, ContextType>;
  hints?: Resolver<Maybe<Array<Maybe<ResolversTypes['Hint']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  likes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  memoryLimitInMB?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  solutions?: Resolver<Maybe<Array<Maybe<ResolversTypes['Solution']>>>, ParentType, ContextType>;
  timeLimitInSeconds?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  topics?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  totalSubmissions?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  userSolutions?: Resolver<Maybe<Array<Maybe<ResolversTypes['UserSolution']>>>, ParentType, ContextType>;
  views?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  problem?: Resolver<Maybe<ResolversTypes['Problem']>, ParentType, ContextType, Partial<QueryProblemArgs>>;
  problems?: Resolver<Maybe<ResolversTypes['GetAllProblemsResponse']>, ParentType, ContextType, Partial<QueryProblemsArgs>>;
  profile?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  userSolution?: Resolver<Maybe<ResolversTypes['UserSolution']>, ParentType, ContextType, RequireFields<QueryUserSolutionArgs, 'id'>>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
};

export type SessionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Session'] = ResolversParentTypes['Session']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  expires?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sessionToken?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SolutionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Solution'] = ResolversParentTypes['Solution']> = {
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  language?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  problemId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  emailVerified?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<Maybe<ResolversTypes['Role']>, ParentType, ContextType>;
  sessions?: Resolver<Maybe<Array<Maybe<ResolversTypes['Session']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSolutionResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserSolution'] = ResolversParentTypes['UserSolution']> = {
  authorId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  dislikes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  likes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  problem?: Resolver<Maybe<ResolversTypes['Problem']>, ParentType, ContextType>;
  problemId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  views?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  DateTime?: GraphQLScalarType;
  Discussion?: DiscussionResolvers<ContextType>;
  Editorial?: EditorialResolvers<ContextType>;
  Example?: ExampleResolvers<ContextType>;
  GenericResponse?: GenericResponseResolvers<ContextType>;
  GetAllProblemsResponse?: GetAllProblemsResponseResolvers<ContextType>;
  Hint?: HintResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Problem?: ProblemResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Session?: SessionResolvers<ContextType>;
  Solution?: SolutionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserSolution?: UserSolutionResolvers<ContextType>;
};

