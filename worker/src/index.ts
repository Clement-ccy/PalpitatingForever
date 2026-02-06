import type { Env } from './core/types';
import { jsonResponse, withCors, handleOptions } from './core/http';
import {
  handleAnalyticsCollect,
  handleAnalyticsEvent,
  handleAdminAnalyticsOverview,
  handleAdminUmamiOverview,
  handleAdminUmamiPages,
  handleAdminUmamiReferrers,
  handleAdminUmamiEvents,
  handleAdminUmamiBreakdown,
  handleAdminUmamiTimeseries,
  handleAdminUmamiRetention,
  runAnalyticsRetention,
} from './analytics/handlers';
import {
  handleCommentsThread,
  handleCommentsSubmit,
  handleCommentsCounts,
  handleCommentsLatest,
  handleCommentsTotal,
} from './comments/handlers';
import {
  handleAdminLogin,
  handleAdminSetup,
  handleAdminSetupStatus,
  handleAdminMe,
  handleAdminComments,
  handleAdminCommentAction,
  handleAdminSettingsGet,
  handleAdminSettingsPost,
  handleAdminCommentAnalyticsOverview,
  handleAdminCommentAnalyticsPages,
  handleAdminCommentAnalyticsBreakdown,
  handleAdminCommentAnalyticsEvents,
  handleAdminCommentAnalyticsReferrers,
  handleAdminCommentAnalyticsTimeseries,
} from './admin/handlers';

const worker = {
  async scheduled(_event: unknown, env: Env): Promise<void> {
    await runAnalyticsRetention(env);
  },
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    if (request.method === 'OPTIONS') {
      return handleOptions(request, env);
    }

    if (pathname === '/v1/analytics/collect' && request.method === 'POST') {
      return handleAnalyticsCollect(request, env);
    }

    if (pathname === '/v1/analytics/event' && request.method === 'POST') {
      return handleAnalyticsEvent(request, env);
    }

    if (pathname === '/v1/comments/thread' && request.method === 'GET') {
      return handleCommentsThread(request, env);
    }

    if (pathname === '/v1/comments/submit' && request.method === 'POST') {
      return handleCommentsSubmit(request, env);
    }

    if (pathname === '/v1/comments/counts' && request.method === 'GET') {
      return handleCommentsCounts(request, env);
    }

    if (pathname === '/v1/comments/latest' && request.method === 'GET') {
      return handleCommentsLatest(request, env);
    }

    if (pathname === '/v1/comments/total' && request.method === 'GET') {
      return handleCommentsTotal(request, env);
    }

    if (pathname === '/v1/admin/auth/login' && request.method === 'POST') {
      return handleAdminLogin(request, env);
    }

    if (pathname === '/v1/admin/auth/setup' && request.method === 'POST') {
      return handleAdminSetup(request, env);
    }

    if (pathname === '/v1/admin/auth/setup-status' && request.method === 'GET') {
      return handleAdminSetupStatus(request, env);
    }

    if (pathname === '/v1/admin/auth/me' && request.method === 'GET') {
      return handleAdminMe(request, env);
    }

    if (pathname === '/v1/admin/comments' && request.method === 'GET') {
      return handleAdminComments(request, env);
    }

    if (pathname === '/v1/admin/analytics/overview' && request.method === 'GET') {
      return handleAdminAnalyticsOverview(request, env);
    }

    if (pathname === '/v1/admin/analytics/umami/overview' && request.method === 'GET') {
      return handleAdminUmamiOverview(request, env);
    }

    if (pathname === '/v1/admin/analytics/umami/pages' && request.method === 'GET') {
      return handleAdminUmamiPages(request, env);
    }

    if (pathname === '/v1/admin/analytics/umami/referrers' && request.method === 'GET') {
      return handleAdminUmamiReferrers(request, env);
    }

    if (pathname === '/v1/admin/analytics/umami/events' && request.method === 'GET') {
      return handleAdminUmamiEvents(request, env);
    }

    if (pathname === '/v1/admin/analytics/umami/timeseries' && request.method === 'GET') {
      return handleAdminUmamiTimeseries(request, env);
    }

    if (pathname === '/v1/admin/analytics/umami/retention' && request.method === 'GET') {
      return handleAdminUmamiRetention(request, env);
    }

    if (pathname === '/v1/admin/analytics/umami/devices' && request.method === 'GET') {
      return handleAdminUmamiBreakdown(request, env, 'device');
    }

    if (pathname === '/v1/admin/analytics/umami/os' && request.method === 'GET') {
      return handleAdminUmamiBreakdown(request, env, 'os');
    }

    if (pathname === '/v1/admin/analytics/umami/browsers' && request.method === 'GET') {
      return handleAdminUmamiBreakdown(request, env, 'browser');
    }

    if (pathname === '/v1/admin/analytics/umami/countries' && request.method === 'GET') {
      return handleAdminUmamiBreakdown(request, env, 'country');
    }

    if (pathname.startsWith('/v1/admin/comments/') && request.method === 'POST') {
      return handleAdminCommentAction(request, env);
    }

    if (pathname === '/v1/admin/settings' && request.method === 'GET') {
      return handleAdminSettingsGet(request, env);
    }

    if (pathname === '/v1/admin/settings' && request.method === 'POST') {
      return handleAdminSettingsPost(request, env);
    }

    if (pathname === '/v1/admin/comments/analytics/overview' && request.method === 'GET') {
      return handleAdminCommentAnalyticsOverview(request, env);
    }

    if (pathname === '/v1/admin/comments/analytics/pages' && request.method === 'GET') {
      return handleAdminCommentAnalyticsPages(request, env);
    }

    if (pathname === '/v1/admin/comments/analytics/referrers' && request.method === 'GET') {
      return handleAdminCommentAnalyticsReferrers(request, env);
    }

    if (pathname === '/v1/admin/comments/analytics/devices' && request.method === 'GET') {
      return handleAdminCommentAnalyticsBreakdown(request, env, 'device');
    }

    if (pathname === '/v1/admin/comments/analytics/os' && request.method === 'GET') {
      return handleAdminCommentAnalyticsBreakdown(request, env, 'os');
    }

    if (pathname === '/v1/admin/comments/analytics/browsers' && request.method === 'GET') {
      return handleAdminCommentAnalyticsBreakdown(request, env, 'browser');
    }

    if (pathname === '/v1/admin/comments/analytics/countries' && request.method === 'GET') {
      return handleAdminCommentAnalyticsBreakdown(request, env, 'country');
    }

    if (pathname === '/v1/admin/comments/analytics/events' && request.method === 'GET') {
      return handleAdminCommentAnalyticsEvents(request, env);
    }

    if (pathname === '/v1/admin/comments/analytics/timeseries' && request.method === 'GET') {
      return handleAdminCommentAnalyticsTimeseries(request, env);
    }

    return withCors(request, env, jsonResponse({ error: 'Not found' }, 404));
  },
};

export default worker;
