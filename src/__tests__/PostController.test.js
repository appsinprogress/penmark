import { render, screen, cleanup, act } from '@testing-library/react';
import { EditPostComponent } from '../PostController.jsx';
import '@testing-library/jest-dom';
import { Octokit } from "octokit";
import { LocalStorageMock } from './testUtils.js';
import userEvent from '@testing-library/user-event'

//global mock of the Octokit constructor
jest.mock("octokit", () => {
    const mockRequest = jest.fn().mockImplementation((requestPath, options) => {
        if(requestPath === 'GET /user'){
            return {
                data: {
                    "login": "octocat",
                    "id": 1,
                    "url": "https://api.github.com/users/octocat",
                    "name": "monalisa octocat",
                    "email": "octocat@github.com",
                }
            }
        }
        else if(requestPath === 'GET /user/emails'){
            return {
                data: [
                    {
                    "email": "octocat@github.com",
                    "verified": true,
                    "primary": true,
                    "visibility": "public"
                    }
                ]
            }
        }
        else if(requestPath === 'GET /repos/{owner}/{repo}/contents/{path}'){
            //if the path is a specific file
            if(options.path === "drafts/2023-05-28-First%20post.md"){
                return {
                    data: {
                        content: "LS0tCgp0aXRsZTogIk15IFNlY29uZCBQb3N0IgpkYXRlOiAyMDIzLTA1LTI5\nVDIxOjE5OjQ1LTA0OjAwCmRyYWZ0OiBmYWxzZQoKLS0tCgojIyBJbnRyb2R1\nY3Rpb24KClRoaXMgaXMgKipib2xkKiogdGV4dCwgYW5kIHRoaXMgaXMgKmVt\ncGhhc2l6ZWQqIHRleHQuCgpWaXNpdCB0aGUgW0h1Z29dKGh0dHBzOi8vZ29o\ndWdvLmlvKSB3ZWJzaXRlIQoKVGhpcyBpcyBteSBzZWNvbmQgcG9zdCAqKnRl\nc3QgXCphbm90aGVyIHRlc3RcKioq\n",
                        encoding: "base64",
                        name: "2023-05-28-First%20post.md",
                        path: "drafts/2023-05-28-First%20post.md",
                    }
                }
            }

            return {
                data: [
                    {
                        name: "2023-05-28-First%20post.md",
                        path: "drafts/2023-05-28-First%20post.md",
                    },
                    {
                        name: "2023-05-28-Second%20post.md",
                        path: "drafts/2023-05-28-Second%20post.md",
                    },
                    {
                        name: "2023-05-28-catimage.png",
                        path: "drafts/2023-05-28-catimage.png",
                    },
                    {
                        name: "template.md",
                        path: "drafts/template.md",
                    }
                ]
            }
        }
    });

    return {
        Octokit: jest.fn().mockImplementation(() => {
            return { request: mockRequest };
        })
    }
});

//global mock of the fetch function
global.fetch = jest.fn(() => 
    Promise.resolve({
        json: () => Promise.resolve({
            token: "token"
        })
    })
);

//global mock of the localStorage
global.localStorage = new LocalStorageMock();
global.localStorage.setItem("edit-blog-content-from-site-session", "session");


describe('show modal', () => {

    beforeEach(() => {
        //clear mocks
        jest.clearAllMocks();
    });


    test('should show modal when edit button is clicked and load content from file', async () => {
        //arrange
        const postFilePath = "drafts/2023-05-28-First%20post.md";
        const draftsFolder = "drafts";
        const postsFolder = "posts";
        const imagesFolder = "images";
        const githubUsername = "githubUsername";
        const githubRepoName = "githubRepoName";

        const user = userEvent.setup()

        //act
        const draftsComponent = render(<EditPostComponent 
            postFilePath={postFilePath}
            draftsFolder={draftsFolder}
            postsFolder={postsFolder}
            imagesFolder={imagesFolder}
            githubUsername={githubUsername}
            githubRepoName={githubRepoName}
        />);

        //user clicks on the edit button
        const editButton = screen.getByTestId('edit-button');
        await user.click(editButton);

        //assert
        //assert that there is a textarea with First post as value
        //find the textarea with value First post to avoid conflict with other div with same value
        const titleElement = screen.getByTestId('textarea-title');
        expect(titleElement).toBeInTheDocument();
        expect(titleElement).toHaveValue("First post");

        //asset that there is "Introduction This is bold text, and this is emphasized text."
        const proseMirrorElement = screen.getByTestId('prosemirror-editor');
        expect(proseMirrorElement).toBeInTheDocument();
        expect(proseMirrorElement).toHaveTextContent("This is bold text, and this is emphasized text.");
        
    })

})
