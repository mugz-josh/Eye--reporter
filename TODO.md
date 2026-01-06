# Fix 400 Bad Request Error for Comment Posting

## Issue
- Frontend API calls use plural forms (e.g., `/v1/red_flags/54/comments`)
- Backend routes expect singular forms (e.g., `/v1/red_flag/54/comments`)
- This mismatch causes validation failure in controllers

## Tasks
- [ ] Update `frontend/src/services/api.ts` to remove 's' from reportType in URLs
- [ ] Fix comments API methods (getComments, addComment)
- [ ] Fix upvotes API methods (upvoteReport, removeUpvote, getUpvotes, toggleUpvote)
- [ ] Test comment posting functionality
- [ ] Verify upvotes functionality still works

## Files to Edit
- `frontend/src/services/api.ts`
