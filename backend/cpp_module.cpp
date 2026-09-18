#include <iostream>
#include <string>
#include <vector>

using namespace std;

// 1. Class & Encapsulation
class CivicIssue {
protected:
    string title;
    string ward;
    string status;

public:
    CivicIssue(string t, string w) : title(t), ward(w), status("Pending") {}
    
    // 4. Polymorphism (Virtual Function)
    virtual void display() {
        cerr << "Issue: " << title << " | Ward: " << ward << " | Status: " << status << endl;
    }
    
    // Getter for Operator Overloading
    string getTitle() const { return title; }
};

// 3. Inheritance
class Pothole : public CivicIssue {
private:
    int severityRadius;
public:
    Pothole(string t, string w, int rad) : CivicIssue(t, w), severityRadius(rad) {}
    
    void display() override {
        cerr << "[POTHOLE] " << title << " | Ward: " << ward << " | Severity: " << severityRadius << "cm" << endl;
    }
};

class Garbage : public CivicIssue {
private:
    bool hazardous;
public:
    Garbage(string t, string w, bool haz) : CivicIssue(t, w), hazardous(haz) {}
    
    void display() override {
        cerr << "[GARBAGE] " << title << " | Ward: " << ward << " | Hazardous: " << (hazardous ? "Yes" : "No") << endl;
    }
};

// 6. Operator Overloading (Duplicate Detection)
bool operator==(const CivicIssue& a, const CivicIssue& b) {
    return a.getTitle() == b.getTitle();
}

// 9. Templates
template <class T>
class DataHandler {
private:
    vector<T*> items;
public:
    void add(T* item) {
        items.push_back(item);
    }
    
    bool checkDuplicate(const T& newItem) {
        for(auto item : items) {
            if (*item == newItem) {
                return true;
            }
        }
        return false;
    }

    void showAll() {
        for(auto item : items) {
            item->display();
        }
    }
};

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << "{\"error\": \"No new issue title provided\"}" << endl;
        return 1;
    }

    string newIssueTitle = argv[1];
    CivicIssue newIssue(newIssueTitle, "Unknown Ward");

    DataHandler<CivicIssue> handler;
    vector<CivicIssue*> memoryItems;

    for (int i = 2; i < argc; ++i) {
        CivicIssue* existingIssue = new CivicIssue(argv[i], "Unknown Ward");
        handler.add(existingIssue);
        memoryItems.push_back(existingIssue);
    }

    bool isDuplicate = false;
    try {
        isDuplicate = handler.checkDuplicate(newIssue);
        if (isDuplicate) {
            throw runtime_error("DuplicateEntryException");
        }
    } catch(const exception& e) {
        cerr << "Caught Exception: " << e.what() << endl;
    }

    if (isDuplicate) {
        cout << "{\"isDuplicate\": true, \"message\": \"Exact duplicate issue detected in database!\"}" << endl;
    } else {
        cout << "{\"isDuplicate\": false, \"message\": \"Issue is unique.\"}" << endl;
    }

    for (auto i : memoryItems) {
        delete i;
    }

    return 0;
}
