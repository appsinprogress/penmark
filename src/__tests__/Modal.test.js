import { render, screen, cleanup, act } from '@testing-library/react';
import { DraftsComponent } from '../DraftsController.jsx';
import '@testing-library/jest-dom';
import { Octokit } from "octokit";
import { LocalStorageMock } from './testUtils.js';
import userEvent from '@testing-library/user-event'
import { Modal } from '../components/Modal.jsx';
import { Base64 } from 'js-base64';

//sample base64 content
const base64content = "IyBUaGlzIGlzIGEgaGVhZGVyCgpUaGlzIGlzIGEgKnNhbXBsZSogKipibG9n\nKiogcG9zdCBmcm9tIFBlbk1hcmsgQ01T\n";
const base64contentTemplate = "VGhpcyBpcyBhbiBleGFtcGxlIHRlbXBsYXRlIGZpbGUK\n";
//global mock of the Octokit constructor
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
                    content: base64content,
                    encoding: "base64",
                    name: "2023-05-28-First%20post.md",
                    path: "drafts/2023-05-28-First%20post.md",
                    sha: "some-sha"
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
const mockRestReposDeleteFile = jest.fn().mockImplementation(() => {
    return {}
});
jest.mock("octokit", () => {
    return {
        Octokit: jest.fn().mockImplementation(() => {
            return { 
                request: mockRequest, 
                rest: {
                    repos: {
                        deleteFile: mockRestReposDeleteFile
                    }
                }
            };
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

describe('modal loads with draft file', () => {
    //arrange
    //create variables for each of setShowModalBoolean, draft, loadDrafts, isDraft, postsFolder, draftsFolder, imagesFolder, githubUsername, githubRepoName
    const setShowModalBoolean = jest.fn();
    const draft = {
        name: "2023-05-28-First%20post.md",
        path: "drafts/2023-05-28-First%20post.md",
    };
    const loadDrafts = true;
    const isDraft = true;
    const postsFolder = "posts";
    const draftsFolder = "drafts";
    const imagesFolder = "images";
    const githubUsername = "githubUsername";
    const githubRepoName = "githubRepoName";

    beforeEach(() => {
        //reset the mock calls
        mockRequest.mockClear();
        mockRestReposDeleteFile.mockClear();

        Octokit.mockImplementation(() => {
            return { 
                request: mockRequest, 
                rest: {
                    repos: {
                        deleteFile: mockRestReposDeleteFile
                    }
                }
            };
        });
    });

    //test that modal loads with file if passed as prop
    test('should load the file draft on mount', async () => {
        //arrange
    
        //act
        const modalComponent = render(<Modal 
            setShowModalBoolean={setShowModalBoolean}
            draft={draft}
            loadDrafts={loadDrafts}
            isDraft={isDraft}
            postsFolder={postsFolder}
            draftsFolder={draftsFolder}
            imagesFolder={imagesFolder}
            githubUsername={githubUsername}
            githubRepoName={githubRepoName}
        />);

        //wait for the modal to load
        await new Promise((r) => setTimeout(r, 1000));

        //click the button arrow
        await act(async () => {
            await userEvent.click(modalComponent.getByTestId("dropdownButton"))
        });

        //assert
        //check that the modal loads with the draft file
        expect(modalComponent.getByText("First post")).toBeInTheDocument();

        //check that input date shows 2023-05-28
        expect(modalComponent.getByDisplayValue("2023-05-28")).toBeInTheDocument();

        //check that the content loads
        expect(modalComponent.getByText("This is a header")).toBeInTheDocument();
        //expect <p> This is a <em>  sample</em> <strong>  blog</strong> post from PenMark CMS </p> to be in the document
        await screen.findByText(textContentMatcher('This is a sample blog post from PenMark CMS'))

        //check that the save button is displayed
        expect(modalComponent.getByText("Save")).toBeInTheDocument();
        //check that the button is not disabled
        expect(modalComponent.getByText("Save")).not.toBeDisabled();
        //check that there exists a publish button and a delete button
        expect(modalComponent.getByText("Publish")).toBeInTheDocument();
        expect(modalComponent.getByText("Delete")).toBeInTheDocument();

    });

    //test that modal loads with no file (loads template)
    test('should load the template draft on mount when no draft provided', async () => {
        //arrange

        //override global mocks with empty drafts array
        const mockRequest = jest.fn().mockImplementationOnce((requestPath, options) => {
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
            else if(requestPath === 'GET /repos/{owner}/{repo}/contents/{path}'){
                return {
                    data: []
                }
            }
        });

        Octokit.mockImplementation(() => {
            return { request: mockRequest };
        });
    
        //act
        const modalComponent = render(<Modal 
            setShowModalBoolean={setShowModalBoolean}
            draft={null}
            loadDrafts={loadDrafts}
            isDraft={isDraft}
            postsFolder={postsFolder}
            draftsFolder={draftsFolder}
            imagesFolder={imagesFolder}
            githubUsername={githubUsername}
            githubRepoName={githubRepoName}
        />);

        //wait for the modal to load
        await new Promise((r) => setTimeout(r, 1000));

        //assert
        //check that the modal loads with the placeholder title Title
        expect(modalComponent.getByPlaceholderText("Title")).toBeInTheDocument();

        //check that input date shows todays date
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        expect(modalComponent.getByDisplayValue(todayString)).toBeInTheDocument();

        //check that the content loads
        await screen.findByText(textContentMatcher('This is an example template file'))
    });

    //test that modal loads with no file (doesn't find template)
    test('should load an empty draft on mount when no draft/no template provided', async () => {
        //arrange

        //override global mocks with empty drafts array
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
                return {
                    data: null
                }
            }
        });

        Octokit.mockImplementation(() => {
            return { request: mockRequest };
        });
    
        //act
        const modalComponent = render(<Modal 
            setShowModalBoolean={setShowModalBoolean}
            draft={null}
            loadDrafts={loadDrafts}
            isDraft={isDraft}
            postsFolder={postsFolder}
            draftsFolder={draftsFolder}
            imagesFolder={imagesFolder}
            githubUsername={githubUsername}
            githubRepoName={githubRepoName}
        />);

        //wait for the modal to load
        await new Promise((r) => setTimeout(r, 1000));

        //assert
        //check that the modal loads with the placeholder title Title
        expect(modalComponent.getByPlaceholderText("Title")).toBeInTheDocument();

        //check that input date shows todays date
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        expect(modalComponent.getByDisplayValue(todayString)).toBeInTheDocument();

        //check that the prosemirror content does not have template content
        expect(modalComponent.getByTestId("prosemirror-editor")).not.toHaveTextContent("template");
    });
})

describe('modal behavioral, buttons and navigation tests', () => {
    //arrange
    //create variables for each of setShowModalBoolean, draft, loadDrafts, isDraft, postsFolder, draftsFolder, imagesFolder, githubUsername, githubRepoName
    const setShowModalBoolean = jest.fn();
    const draft = {
        name: "2023-05-28-First%20post.md",
        path: "drafts/2023-05-28-First%20post.md",
    };
    const loadDrafts = true;
    const isDraft = true;
    const postsFolder = "posts";
    const draftsFolder = "drafts";
    const imagesFolder = "images";
    const githubUsername = "githubUsername";
    const githubRepoName = "githubRepoName";

    beforeEach(() => {
        //reset the mock calls
        mockRequest.mockClear();
        mockRestReposDeleteFile.mockClear();

        Octokit.mockImplementation(() => {
            return { 
                request: mockRequest, 
                rest: {
                    repos: {
                        deleteFile: mockRestReposDeleteFile
                    }
                }
            };
        });
    });

    //test that modal renders publish with no save option when this is coming from a post
    test('should render publish button with no save button when coming from a post', async () => {
        //arrange
        const isDraft = false;
    
        //act
        const modalComponent = render(<Modal 
            setShowModalBoolean={setShowModalBoolean}
            draft={draft}
            loadDrafts={loadDrafts}
            isDraft={isDraft}
            postsFolder={postsFolder}
            draftsFolder={draftsFolder}
            imagesFolder={imagesFolder}
            githubUsername={githubUsername}
            githubRepoName={githubRepoName}
        />);

        //wait for the modal to load
        await new Promise((r) => setTimeout(r, 1000));

        //click the button arrow
        await act(async () => {
            await userEvent.click(modalComponent.getByTestId("dropdownButton"))
        });

        //assert
        //check that the modal loads with the draft file
        expect(modalComponent.getByText("First post")).toBeInTheDocument();

        //check that input date shows 2023-05-28
        expect(modalComponent.getByDisplayValue("2023-05-28")).toBeInTheDocument();

        //check that the content loads
        expect(modalComponent.getByText("This is a header")).toBeInTheDocument();
        //expect <p> This is a <em>  sample</em> <strong>  blog</strong> post from PenMark CMS </p> to be in the document
        await screen.findByText(textContentMatcher('This is a sample blog post from PenMark CMS'))

        //check that the save button is displayed
        expect(modalComponent.queryByLabelText("Save")).toBeNull();
        //check that there exists a publish button and a delete button
        expect(modalComponent.getByText("Publish")).toBeInTheDocument();
        expect(modalComponent.getByText("Delete")).toBeInTheDocument();
    });

    //test that the button toggles between prosemirror and markdown
    test('should toggle between prosemirror and markdown', async () => {
        //arrange

        //act
        const modalComponent = render(<Modal 
            setShowModalBoolean={setShowModalBoolean}
            draft={draft}
            loadDrafts={loadDrafts}
            isDraft={isDraft}
            postsFolder={postsFolder}
            draftsFolder={draftsFolder}
            imagesFolder={imagesFolder}
            githubUsername={githubUsername}
            githubRepoName={githubRepoName}
        />);

        //wait for the modal to load
        await new Promise((r) => setTimeout(r, 1000));

        //click prosemirror-markdown-toggle button
        await act(async () => {
            await userEvent.click(modalComponent.getByTestId("markdown-toggle-button"))
        });

        //assert
        //check that the markdown content is displayed
        expect(modalComponent.getByTestId("markdown-editor")).toBeInTheDocument();
        
        expect(modalComponent.getByTestId("markdown-editor")).toHaveTextContent("This is a *sample* **blog** post from PenMark CMS");
    });
});

describe('modal api call requests', () => {

    //arrange
    const setShowModalBoolean = jest.fn();
    const draft = {
        name: "2023-05-28-First%20post.md",
        path: "drafts/2023-05-28-First%20post.md",
    };
    const loadDrafts = jest.fn();
    const isDraft = true;
    const postsFolder = "posts";
    const draftsFolder = "drafts";
    const imagesFolder = "images";
    const githubUsername = "githubUsername";
    const githubRepoName = "githubRepoName";

    beforeEach(() => {
        //reset the mock calls
        mockRequest.mockClear();
        mockRestReposDeleteFile.mockClear();

        Octokit.mockImplementation(() => {
            return { 
                request: mockRequest, 
                rest: {
                    repos: {
                        deleteFile: mockRestReposDeleteFile
                    }
                }
            };
        });
    });

    //test that pressing save calls the github api with the changes
    test('should call the github api with the changes when save is pressed', async () => {
        //arrange
        window.alert = jest.fn();
        const newMarkdownContent = "This is a change to the draft.";
        const newMarkdownContentBase64 = Base64.encode(newMarkdownContent);

        //act
        const modalComponent = render(<Modal 
            setShowModalBoolean={setShowModalBoolean}
            draft={draft}
            loadDrafts={loadDrafts}
            isDraft={isDraft}
            postsFolder={postsFolder}
            draftsFolder={draftsFolder}
            imagesFolder={imagesFolder}
            githubUsername={githubUsername}
            githubRepoName={githubRepoName}
        />);

        //wait for the modal to load
        await new Promise((r) => setTimeout(r, 1000));

        //we cannot easily test the prosemirror editor, so we will make our changes
        //to the markdown editor, and then convert again before saving
        //click prosemirror-markdown-toggle button
        await act(async () => {
            await userEvent.click(modalComponent.getByTestId("markdown-toggle-button"))
        });

        //assert
        //check that the markdown content is displayed
        expect(modalComponent.getByTestId("markdown-editor")).toBeInTheDocument();
        expect(modalComponent.getByTestId("markdown-editor")).toHaveTextContent("This is a *sample* **blog** post from PenMark CMS");

        //change the markdown content by simulating the user clearing and typing into the markdown editor
        await act(async () => {
            await userEvent.clear(modalComponent.getByTestId("markdown-editor"));
            await userEvent.type(modalComponent.getByTestId("markdown-editor"), newMarkdownContent);
        });
        expect(modalComponent.getByTestId("markdown-editor")).toHaveTextContent(newMarkdownContent);

        // //print all requests to the mock
        // mockRequest.mock.calls.forEach((call, index) => {
        //     console.log(`Call ${index + 1}:`, call);
        // });

        //click the save button
        await act(async () => {
            await userEvent.click(modalComponent.getByTestId("dropdownDefaultButton"))
        })

        //expect call #2 to be the PUT call to the github api
        expect(mockRequest).toHaveBeenNthCalledWith(
            2,
            "PUT /repos/{owner}/{repo}/contents/{path}",
            {
                "message": "update draft [skip ci]",
                "owner": "githubUsername",
                "path": "drafts/2023-05-28-First%20post.md",
                "repo": "githubRepoName",
                "content": newMarkdownContentBase64,
                "sha": "some-sha"
            }
        );
    });

    //test that publish calls the github api with the changes
    test('should call the github api with the changes to the publish folder when publish is pressed', async () => {
        //arrange
        window.alert = jest.fn();
        window.confirm = jest.fn(() => true);
        const newMarkdownContent = "This is a change to the draft.";
        const newMarkdownContentBase64 = Base64.encode(newMarkdownContent);
        const isDraft = false;

        //act
        const modalComponent = render(<Modal 
            setShowModalBoolean={setShowModalBoolean}
            draft={draft}
            loadDrafts={loadDrafts}
            isDraft={isDraft}
            postsFolder={postsFolder}
            draftsFolder={draftsFolder}
            imagesFolder={imagesFolder}
            githubUsername={githubUsername}
            githubRepoName={githubRepoName}
        />);

        //wait for the modal to load
        await new Promise((r) => setTimeout(r, 1000));

        //we cannot easily test the prosemirror editor, so we will make our changes
        //to the markdown editor, and then convert again before saving
        //click prosemirror-markdown-toggle button
        await act(async () => {
            await userEvent.click(modalComponent.getByTestId("markdown-toggle-button"))
        });

        //assert
        //check that the markdown content is displayed
        expect(modalComponent.getByTestId("markdown-editor")).toBeInTheDocument();
        expect(modalComponent.getByTestId("markdown-editor")).toHaveTextContent("This is a *sample* **blog** post from PenMark CMS");

        //change the markdown content by simulating the user clearing and typing into the markdown editor
        await act(async () => {
            await userEvent.clear(modalComponent.getByTestId("markdown-editor"));
            await userEvent.type(modalComponent.getByTestId("markdown-editor"), newMarkdownContent);
        });
        expect(modalComponent.getByTestId("markdown-editor")).toHaveTextContent(newMarkdownContent);

        // //print all requests to the mock
        // mockRequest.mock.calls.forEach((call, index) => {
        //     console.log(`Call ${index + 1}:`, call);
        // });

        //click the save button
        await act(async () => {
            await userEvent.click(modalComponent.getByTestId("dropdownDefaultButton"))
        })

        //expect mockRestReposDeleteFile to have been called
        expect(mockRestReposDeleteFile).toHaveBeenCalledWith({
            "message": "delete draft [skip ci]",
            "owner": "githubUsername",
            "path": "drafts/2023-05-28-First%20post.md",
            "repo": "githubRepoName",
            "sha": "some-sha"
        });

        // mockRestReposDeleteFile.mock.calls.forEach((call, index) => {
        //     console.log(`Call ${index + 1}:`, call);
        // });

        // //print all requests to the mock
        // mockRequest.mock.calls.forEach((call, index) => {
        //     console.log(`Call ${index + 1}:`, call);
        // });

        //expect call #2 to be the PUT call to the github api
        expect(mockRequest).toHaveBeenNthCalledWith(
            2,
            "PUT /repos/{owner}/{repo}/contents/{path}",
            {
                "message": "update draft",
                "owner": "githubUsername",
                "path": "posts/2023-05-28-First%20post.md",
                "repo": "githubRepoName",
                "content": newMarkdownContentBase64
            }
        );
    });

    //test that delete calls the github api with the changes
    test('should call the github api to delete files when delete is pressed', async () => {
        //arrange
        window.alert = jest.fn();
        window.confirm = jest.fn(() => true);
        const newMarkdownContent = "This is a change to the draft.";
        const newMarkdownContentBase64 = Base64.encode(newMarkdownContent);

        //act
        const modalComponent = render(<Modal 
            setShowModalBoolean={setShowModalBoolean}
            draft={draft}
            loadDrafts={loadDrafts}
            isDraft={isDraft}
            postsFolder={postsFolder}
            draftsFolder={draftsFolder}
            imagesFolder={imagesFolder}
            githubUsername={githubUsername}
            githubRepoName={githubRepoName}
        />);

        //wait for the modal to load
        await new Promise((r) => setTimeout(r, 1000));

        //click the dropdown button
        await act(async () => {
            await userEvent.click(modalComponent.getByTestId("dropdownButton"))

        })

        //click the delete button
        await act(async () => {
            await userEvent.click(modalComponent.getByText("Delete"))
        })

        // //print all requests to the mock
        // mockRestReposDeleteFile.mock.calls.forEach((call, index) => {
        //     console.log(`Call ${index + 1}:`, call);
        // });

        //expect mockRestReposDeleteFile to have been called
        expect(mockRestReposDeleteFile).toHaveBeenCalledWith({
            "message": "delete draft [skip ci]",
            "owner": "githubUsername",
            "path": "drafts/2023-05-28-First%20post.md",
            "repo": "githubRepoName",
            "sha": "some-sha"
        });
    });
});

// TODO: add testing for the image handling

//helpers
function textContentMatcher(text) {
    return function (_content, node) {
      const hasText = (node) => node.textContent === text
      const nodeHasText = hasText(node)
      const childrenDontHaveText = Array.from(node?.children || []).every(
        (child) => !hasText(child)
      )
      return nodeHasText && childrenDontHaveText
    }
  }