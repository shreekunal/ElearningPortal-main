const { Unit, Course, Student_Course, Instructor_Course, User } = require('../db/Database');
const { v4 } = require('uuid');

class UnitController {

    async createUnit(req, res, next) {
        try {
            const { courseId } = req.params;
            const { title, chapters, quiz } = req.body;
            const unitId = v4();

            // Find the course
            const course = await Course.findOne({ id: courseId });
            if (!course) {
                return res.status(200).json({ error: "Invalid course" });
            }

            // Validate required fields
            if (!title || !title.trim()) {
                return res.status(200).json({ error: "Unit title is required" });
            }

            if (!chapters || chapters.length === 0) {
                return res.status(200).json({ error: "At least one chapter is required" });
            }

            if (!quiz || !quiz.title || !quiz.questions || quiz.questions.length === 0) {
                return res.status(200).json({ error: "Quiz with at least one question is required" });
            }

            // Validate chapters
            for (const chapter of chapters) {
                if (!chapter.title || !chapter.title.trim()) {
                    return res.status(200).json({ error: "All chapters must have titles" });
                }
                if (!chapter.sections || chapter.sections.length === 0) {
                    return res.status(200).json({ error: "Each chapter must have at least one section" });
                }
                for (const section of chapter.sections) {
                    if (!section.heading || !section.heading.trim()) {
                        return res.status(200).json({ error: "All sections must have headings" });
                    }
                }
            }

            // Validate quiz questions
            for (const question of quiz.questions) {
                if (!question.question || !question.question.trim()) {
                    return res.status(200).json({ error: "All quiz questions must have content" });
                }
                if (!question.options || question.options.length < 2) {
                    return res.status(200).json({ error: "Each question must have at least 2 options" });
                }
                if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
                    return res.status(200).json({ error: "Invalid correct answer index" });
                }
            }

            // Create the unit
            const unit = await Unit.create({
                id: unitId,
                title,
                courseID: course._id,
                chapters,
                quiz
            });

            // Get all enrolled students for this course to make materials available
            const enrolledStudents = await Student_Course.find({ courseID: course._id })
                .populate('studentID', 'id name email');

            const populatedUnit = await Unit.findById(unit._id)
                .populate('courseID', 'id title');

            // Log the unit creation for enrolled students (could be extended with notifications)
            console.log(`Unit "${title}" created for course "${course.title}"`);
            console.log(`Available to ${enrolledStudents.length} enrolled students:`);
            enrolledStudents.forEach(enrollment => {
                console.log(`- Student: ${enrollment.studentID.name} (${enrollment.studentID.email})`);
            });

            res.status(201).json({
                data: {
                    id: populatedUnit.id,
                    title: populatedUnit.title,
                    course: populatedUnit.courseID.id,
                    courseName: populatedUnit.courseID.title,
                    chapters: populatedUnit.chapters,
                    quiz: populatedUnit.quiz,
                    createdAt: populatedUnit.createdAt,
                    availableToStudents: enrolledStudents.length
                },
                message: `Unit "${title}" created successfully and made available to ${enrolledStudents.length} enrolled students`
            });

        } catch (error) {
            res.status(200).json({ error: error.message });
            next(`ERROR IN: Create Unit function => ${error.message}`);
        }
    }

    async getCourseUnits(req, res, next) {
        try {
            const { courseId } = req.params;

            // Find the course
            const course = await Course.findOne({ id: courseId });
            if (!course) {
                return res.status(200).json({ error: "Invalid course" });
            }

            // Get all units for this course
            const units = await Unit.find({ courseID: course._id })
                .populate('courseID', 'id title')
                .sort({ createdAt: -1 });

            const formattedUnits = units.map(unit => ({
                id: unit.id,
                title: unit.title,
                course: unit.courseID.id,
                courseName: unit.courseID.title,
                chaptersCount: unit.chapters.length,
                questionsCount: unit.quiz.questions.length,
                createdAt: unit.createdAt
            }));

            res.status(201).json({ data: formattedUnits });

        } catch (error) {
            res.status(200).json({ error: error.message });
            next(`ERROR IN: Get Course Units function => ${error.message}`);
        }
    }

    async getUnit(req, res, next) {
        try {
            const { unitId } = req.params;

            const unit = await Unit.findOne({ id: unitId })
                .populate('courseID', 'id title');

            if (!unit) {
                return res.status(200).json({ error: "Unit not found" });
            }

            res.status(201).json({
                data: {
                    id: unit.id,
                    title: unit.title,
                    course: unit.courseID.id,
                    courseName: unit.courseID.title,
                    chapters: unit.chapters,
                    quiz: unit.quiz,
                    createdAt: unit.createdAt
                }
            });

        } catch (error) {
            res.status(200).json({ error: error.message });
            next(`ERROR IN: Get Unit function => ${error.message}`);
        }
    }

    async updateUnit(req, res, next) {
        try {
            const { unitId } = req.params;
            const { title, chapters, quiz } = req.body;

            const unit = await Unit.findOne({ id: unitId });
            if (!unit) {
                return res.status(200).json({ error: "Unit not found" });
            }

            // Validate required fields
            if (!title || !title.trim()) {
                return res.status(200).json({ error: "Unit title is required" });
            }

            if (!chapters || chapters.length === 0) {
                return res.status(200).json({ error: "At least one chapter is required" });
            }

            if (!quiz || !quiz.title || !quiz.questions || quiz.questions.length === 0) {
                return res.status(200).json({ error: "Quiz with at least one question is required" });
            }

            // Update the unit
            unit.title = title;
            unit.chapters = chapters;
            unit.quiz = quiz;

            await unit.save();

            const populatedUnit = await Unit.findById(unit._id)
                .populate('courseID', 'id title');

            res.status(201).json({
                data: {
                    id: populatedUnit.id,
                    title: populatedUnit.title,
                    course: populatedUnit.courseID.id,
                    courseName: populatedUnit.courseID.title,
                    chapters: populatedUnit.chapters,
                    quiz: populatedUnit.quiz,
                    createdAt: populatedUnit.createdAt
                },
                message: `Unit "${title}" updated successfully`
            });

        } catch (error) {
            res.status(200).json({ error: error.message });
            next(`ERROR IN: Update Unit function => ${error.message}`);
        }
    }

    async deleteUnit(req, res, next) {
        try {
            const { unitId } = req.params;

            const unit = await Unit.findOneAndDelete({ id: unitId });
            if (!unit) {
                return res.status(200).json({ error: "Unit not found" });
            }

            res.status(201).json({
                data: unit,
                message: `Unit "${unit.title}" deleted successfully`
            });

        } catch (error) {
            res.status(200).json({ error: error.message });
            next(`ERROR IN: Delete Unit function => ${error.message}`);
        }
    }

    async getUnitsForUser(req, res, next) {
        try {
            const { userId } = req.body;

            const user = await User.findOne({ id: userId });
            if (!user) {
                return res.status(200).json({ error: "Invalid user" });
            }

            let userCourses = [];

            if (user.role.toLowerCase() === "student") {
                const studentCourses = await Student_Course.find({ studentID: user._id });
                userCourses = studentCourses.map(sc => sc.courseID);
            } else if (user.role.toLowerCase() === "instructor") {
                const instructorCourses = await Instructor_Course.find({ instructorID: user._id });
                userCourses = instructorCourses.map(ic => ic.courseID);
            } else if (user.role.toLowerCase() === "admin") {
                // Admin can see all courses
                const allCourses = await Course.find({});
                userCourses = allCourses.map(course => course._id);
            }

            // Get all units for user's courses
            const units = await Unit.find({ courseID: { $in: userCourses } })
                .populate('courseID', 'id title')
                .sort({ createdAt: -1 });

            const formattedUnits = units.map(unit => ({
                id: unit.id,
                title: unit.title,
                course: unit.courseID.id,
                courseName: unit.courseID.title,
                chaptersCount: unit.chapters.length,
                questionsCount: unit.quiz.questions.length,
                createdAt: unit.createdAt
            }));

            res.status(201).json({ data: formattedUnits });

        } catch (error) {
            res.status(200).json({ error: error.message });
            next(`ERROR IN: Get Units for User function => ${error.message}`);
        }
    }
}

module.exports = new UnitController();
