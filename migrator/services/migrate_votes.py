from migrator.utils import paginated_query
from questions.models import Question, Vote
from users.models import User


def create_vote(vote_obj, direction: Vote.VoteDirection):
    return Vote(
        user_id=vote_obj["user_id"],
        question_id=vote_obj["question_id"],
        direction=direction,
    )


def migrate_votes():
    question_ids = Question.objects.values_list("id", flat=True)
    vote_instances = []
    users = User.objects.all()
    users_dict = {x.id: x for x in users}

    # Migrating Upvotes
    vote_instances += [
        create_vote(obj, Vote.VoteDirection.UP)
        for obj in paginated_query(
            "SELECT * FROM metac_question_question_votes_up",
        )
        if (obj["question_id"] in question_ids) and (obj["user_id"] in users_dict)
    ]

    # Migrating Downvotes
    vote_instances += [
        create_vote(obj, Vote.VoteDirection.DOWN)
        for obj in paginated_query(
            "SELECT * FROM metac_question_question_votes_down",
        )
        if (obj["question_id"] in question_ids) and (obj["user_id"] in users_dict)
    ]

    Vote.objects.bulk_create(vote_instances, ignore_conflicts=True)
