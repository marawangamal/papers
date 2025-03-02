from .arxiv_paper_identifier import ArxivPaper, get_arxiv_paper


def test_arxiv_papers():
    papers = [
        ArxivPaper(
            title="Supercharging Imbalanced Data Learning With Energy-based Contrastive Representation Transfer",
            arxiv_id="2011.12454",
            arxiv_url="https://arxiv.org/abs/2011.12454",
        ),
        ArxivPaper(
            title="Attention is All You Need",
            arxiv_id="1706.03762",
            arxiv_url="https://arxiv.org/abs/1706.03762",
        ),
        ArxivPaper(
            title="Transformers meet Stochastic Block Models: Attention with Data-Adaptive Sparsity and Cost",
            arxiv_id="2210.15541",
            arxiv_url="https://arxiv.org/abs/2210.15541",
        ),
        ArxivPaper(
            title="On skip connections and normalisation layers in deep optimisation",
            arxiv_id="2210.05371",
            arxiv_url="https://arxiv.org/abs/2210.05371",
        ),
        ArxivPaper(
            title="Dancing to Music",
            arxiv_id="1911.02001",
            arxiv_url="https://arxiv.org/abs/1911.02001",
        ),
        ArxivPaper(
            title="SkipPredict: When to Invest in Predictions for Scheduling",
            arxiv_id="2402.03564",
            arxiv_url="https://arxiv.org/abs/2402.03564",
        ),
        ArxivPaper(
            title="Towards Biologically Plausible Convolutional Networks",
            arxiv_id="2106.13031",
            arxiv_url="https://arxiv.org/abs/2106.13031",
        ),
        ArxivPaper(
            title="Navigating Chemical Space with Latent Flows",
            arxiv_id="2405.03987",
            arxiv_url="https://arxiv.org/abs/2405.03987",
        ),
        ArxivPaper(
            # Doesn't exist on arxiv
            title="Online Metric Learning and Fast Similarity Search",
            arxiv_url=None,
            arxiv_id=None,
        ),
    ]

    corrects = 0
    total = len(papers)
    for paper in papers:
        result = get_arxiv_paper(paper.title)

        # Something went wrong, skip
        if result.error:
            continue

        # No paper actually exists, we shouldn't find one
        if not paper.arxiv_id:
            if result.not_found:
                corrects += 1
            continue

        # Paper exists, we should find it
        if paper.arxiv_id == result.paper.arxiv_id:
            corrects += 1

    print(f"Total correct papers: {corrects}/{total}")
    print(f"Accuracy: {corrects / total:.2%}")

    assert (
        corrects == total
    ), f"Some papers were not correctly identified: {corrects}/{total}"
