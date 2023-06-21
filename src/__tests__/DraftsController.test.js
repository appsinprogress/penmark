import { render, screen, cleanup, act } from '@testing-library/react';
import { DraftsComponent } from '../DraftsController.jsx';
import '@testing-library/jest-dom';
import { Octokit } from "octokit";
import { LocalStorageMock } from './testUtils.js';
import userEvent from '@testing-library/user-event'

//sample base64 content
const base64contentTemplate = "VGhpcyBpcyBhbiBleGFtcGxlIHRlbXBsYXRlIGZpbGUK\n";

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
            else if(requestPath === 'GET /repos/{owner}/{repo}/contents/{path}' &&
                options.path.includes("template.md")){ 
                                
                return {
                    data: {
                        content: base64contentTemplate,
                        encoding: "base64",
                        name: "template.md",
                        path: "drafts/template.md",
                    }
                }
            }
            else{
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

describe('load drafts on mount', () => {
    //arrange
    const draftsFolder = "drafts";
    const postsFolder = "posts";
    const imagesFolder = "images";
    const githubUsername = "githubUsername";
    const githubRepoName = "githubRepoName";

    test('should load the drafts on mount', async () => {
        //arrange
    
        //act
        const draftsComponent = render(<DraftsComponent 
            draftsFolder={draftsFolder}
            postsFolder={postsFolder}
            imagesFolder={imagesFolder}
            githubUsername={githubUsername}
            githubRepoName={githubRepoName}
        />);

        //assert
        //write test ensuring that "Drafts" is rendered
        const draftsElement = screen.getByText(/Drafts/i);
        expect(draftsElement).toBeInTheDocument();
        expect(draftsElement).toHaveTextContent("Drafts");
    
        //ensure that the posts are rendered
        const firstPostElement = await screen.findByText(/First post/i);
        expect(firstPostElement).toBeInTheDocument();
        expect(firstPostElement).toHaveTextContent("First post");
        const secondPostElement = await screen.findByText(/Second post/i);
        expect(secondPostElement).toBeInTheDocument();
        expect(secondPostElement).toHaveTextContent("Second post");
    
        await new Promise((r) => setTimeout(r, 2000));
    });

    test('should load the drafts from the repo and ignore files that don\'t end with .md', async () => {
        //arrange

        //act
        const draftsComponent = render(<DraftsComponent 
            draftsFolder={draftsFolder}
            postsFolder={postsFolder}
            imagesFolder={imagesFolder}
            githubUsername={githubUsername}
            githubRepoName={githubRepoName}
        />);

        //assert
        //ensure that the posts are rendered
        const firstPostElement = await screen.findByText(/First post/i);
        expect(firstPostElement).toBeInTheDocument();
        expect(firstPostElement).toHaveTextContent("First post");
        const secondPostElement = await screen.findByText(/Second post/i);
        expect(secondPostElement).toBeInTheDocument();
        expect(secondPostElement).toHaveTextContent("Second post");
        //ensure that the image is not rendered
        const imageElement = screen.queryByText(/catimage/i);
        expect(imageElement).not.toBeInTheDocument();

    });

    test('should load the drafts from the repo and ignore the template.md file', async () => {
        //arrange

        //act
        const draftsComponent = render(<DraftsComponent 
            draftsFolder={draftsFolder}
            postsFolder={postsFolder}
            imagesFolder={imagesFolder}
            githubUsername={githubUsername}
            githubRepoName={githubRepoName}
        />);

        //assert
        //ensure that the posts are rendered
        const firstPostElement = await screen.findByText(/First post/i);
        expect(firstPostElement).toBeInTheDocument();
        expect(firstPostElement).toHaveTextContent("First post");
        const secondPostElement = await screen.findByText(/Second post/i);
        expect(secondPostElement).toBeInTheDocument();
        expect(secondPostElement).toHaveTextContent("Second post");
        //ensure that the template is not rendered
        const templateElement = screen.queryByText(/template/i);
        expect(templateElement).not.toBeInTheDocument();

        // //timeout
        // await new Promise((r) => setTimeout(r, 2000));
        // screen.debug();
    });
})


describe('show modal', () => {

    test('should show modal when a draft is clicked', async () => {
        //arrange
        const draftsFolder = "drafts";
        const postsFolder = "posts";
        const imagesFolder = "images";
        const githubUsername = "githubUsername";
        const githubRepoName = "githubRepoName";

        const user = userEvent.setup()

        //act
        const draftsComponent = render(<DraftsComponent 
            draftsFolder={draftsFolder}
            postsFolder={postsFolder}
            imagesFolder={imagesFolder}
            githubUsername={githubUsername}
            githubRepoName={githubRepoName}
        />);

        //user clicks on the first post
        const firstPostElement = await screen.findByText(/First post/i)
        await user.click(firstPostElement);

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

    test('should show modal when pencil icon is clicked', async () => {
        //arrange
        const draftsFolder = "drafts";
        const postsFolder = "posts";
        const imagesFolder = "images";
        const githubUsername = "githubUsername";
        const githubRepoName = "githubRepoName";

        const user = userEvent.setup()

        //act
        const draftsComponent = render(<DraftsComponent 
            draftsFolder={draftsFolder}
            postsFolder={postsFolder}
            imagesFolder={imagesFolder}
            githubUsername={githubUsername}
            githubRepoName={githubRepoName}
        />);
        
        //get the pencil icon
        const pencilIcon = await screen.findByTestId("cms-drafts-create");
        //click the pencil icon
        await user.click(pencilIcon);
        
        //assert
        //assert that there is a textarea with Title as placeholder
        const titleElement = await screen.findByPlaceholderText(/Title/i);
        expect(titleElement).toBeInTheDocument();
        expect(titleElement).toHaveAttribute("placeholder", "Title");

        //assert that there is a div with class ProseMirror present and contenteditable attribute set to true
        const proseMirrorElement = await screen.findByTestId("prosemirror-editor");
        expect(proseMirrorElement).toBeInTheDocument();
        expect(proseMirrorElement).toHaveAttribute("contenteditable", "true");
        expect(proseMirrorElement).toHaveClass("ProseMirror");
        
        //assert that there is a button with text "Save" present
        const saveButtonElement = await screen.findByText(/Save/i);
        expect(saveButtonElement).toBeInTheDocument();
        expect(saveButtonElement).toHaveTextContent("Save");
    });
})

describe('render table', () => {

    test('should render a message when the drafts are empty', async () => {
        //arrange

        //override global mocks with empty drafts array
        const mockRequest = jest.fn().mockImplementation((requestPath) => {
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
                return {
                    data: []
                }
            }
        });

        Octokit.mockImplementation(() => {
            return { request: mockRequest };
        });

        const draftsFolder = "drafts";
        const postsFolder = "posts";
        const imagesFolder = "images";
        const githubUsername = "githubUsername";
        const githubRepoName = "githubRepoName";

        //act
        const draftsComponent = render(<DraftsComponent 
            draftsFolder={draftsFolder}
            postsFolder={postsFolder}
            imagesFolder={imagesFolder}
            githubUsername={githubUsername}
            githubRepoName={githubRepoName}
        />);

        //timeout
        // await new Promise((r) => setTimeout(r, 2000));
        // screen.debug();

        //assert
        //ensure that the message is rendered
        const messageElement = await screen.findByText(/No drafts found/i);
        expect(messageElement).toBeInTheDocument();
        expect(messageElement).toHaveTextContent("No drafts found");
        const messageElement2 = await screen.findByText(/Create a new draft by clicking the pencil icon above/i);
        expect(messageElement2).toBeInTheDocument();
        expect(messageElement2).toHaveTextContent("Create a new draft by clicking the pencil icon above");

    });

})
