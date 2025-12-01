// src/validators/forum.validators.ts
import { Errors } from "../errors/ApiError.js";
import {
  CreateAnswerInput,
  CreateQuestionInput,
  CreateTopicInput,
  QuestionFilter,
  TopicFilter,
  UpdateAnswerInput,
  UpdateQuestionInput,
} from "../types/forum.types.js";

/* ---------- helpers ---------- */

export const parseIdParam = (raw: string, name: string): number => {
  const n = Number(raw);
  if (isNaN(n)) {
    throw Errors.Validation(`${name} must be a number`);
  }
  return n;
};

/* ---------- Topics ---------- */

export const validateCreateTopic = (body: any): CreateTopicInput => {
  const { title, description } = body;

  if (!title || typeof title !== "string") {
    throw Errors.Validation("title is required");
  }

  const out: CreateTopicInput = { title: title.trim() };

  if (description !== undefined) {
    if (typeof description !== "string") {
      throw Errors.Validation("description must be a string");
    }
    out.description = description.trim();
  }

  return out;
};

export const validateTopicFilter = (query: any): TopicFilter => {
  const page =
    query.page && !isNaN(Number(query.page)) ? Number(query.page) : 1;
  const limit =
    query.limit && !isNaN(Number(query.limit)) ? Number(query.limit) : 10;

  return { page, limit };
};

/* ---------- Questions ---------- */

export const validateCreateQuestion = (body: any): CreateQuestionInput => {
  const { title, body: qBody, topicId } = body;

  if (!title || typeof title !== "string") {
    throw Errors.Validation("title is required");
  }
  if (!qBody || typeof qBody !== "string") {
    throw Errors.Validation("body is required");
  }
  if (topicId === undefined || isNaN(Number(topicId))) {
    throw Errors.Validation("topicId is required and must be a number");
  }

  return {
    title: title.trim(),
    body: qBody.trim(),
    topicId: Number(topicId),
  };
};

export const validateUpdateQuestion = (body: any): UpdateQuestionInput => {
  const out: UpdateQuestionInput = {};

  if (body.title !== undefined) {
    if (typeof body.title !== "string") {
      throw Errors.Validation("title must be a string");
    }
    out.title = body.title.trim();
  }

  if (body.body !== undefined) {
    if (typeof body.body !== "string") {
      throw Errors.Validation("body must be a string");
    }
    out.body = body.body.trim();
  }

  if (out.title === undefined && out.body === undefined) {
    throw Errors.Validation("Nothing to update");
  }

  return out;
};

export const validateQuestionFilter = (query: any): QuestionFilter => {
  const filter: QuestionFilter = {};

  if (query.topicId !== undefined) {
    const topicId = Number(query.topicId);
    if (isNaN(topicId)) {
      throw Errors.Validation("topicId must be a number");
    }
    filter.topicId = topicId;
  }

  filter.page =
    query.page && !isNaN(Number(query.page)) ? Number(query.page) : 1;
  filter.limit =
    query.limit && !isNaN(Number(query.limit)) ? Number(query.limit) : 10;

  return filter;
};

/* ---------- Answers ---------- */

export const validateCreateAnswer = (body: any): CreateAnswerInput => {
  const { body: aBody } = body;

  if (!aBody || typeof aBody !== "string") {
    throw Errors.Validation("body is required");
  }

  return { body: aBody.trim() };
};

export const validateUpdateAnswer = (body: any): UpdateAnswerInput => {
  const { body: aBody } = body;

  if (!aBody || typeof aBody !== "string") {
    throw Errors.Validation("body is required and must be a string");
  }

  return { body: aBody.trim() };
};
